import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '../sanity/env';
import fs from 'fs';
import path from 'path';

const token = process.env.SANITY_API_TOKEN;

if (!token) {
    console.error("SANITY_API_TOKEN is missing in environment variables.");
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token
});

function getHexCodes(topName: string, bottomName: string) {
    const map: Record<string, string> = {
        'chocolate': '#7B3F00',
        'choclate': '#7B3F00',
        'white': '#FFFFFF',
        'blue': '#1D4ED8',
        'lightpink': '#FFB6C1',
        'light pink': '#FFB6C1',
        'red': '#EF4444',
        'yellow': '#EAB308',
        'light blue': '#32445E' // Denim blue
    };
    return {
        topHex: map[topName.toLowerCase().trim()] || '#000000',
        bottomHex: map[bottomName.toLowerCase().trim()] || '#000000'
    };
}

function parseFolderName(folderName: string) {
    let clean = folderName.replace(/set/gi, '').trim();
    let parts = clean.split('-');
    
    if (parts.length === 2) {
        return {
            top: parts[0].trim(),
            bottom: parts[1].trim()
        };
    }
    
    // Fallback for "blue light blue" without hyphen
    if (clean.startsWith('blue light blue')) {
        return {
            top: 'blue',
            bottom: 'light blue'
        };
    }
    if (clean.startsWith('red light blue')) {
        return {
            top: 'red',
            bottom: 'light blue'
        };
    }

    return { top: 'unknown', bottom: 'unknown' };
}

async function uploadImage(filePath: string) {
    console.log(`Uploading ${filePath}...`);
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
        filename: path.basename(filePath)
    });
    return {
        _type: 'image',
        asset: {
            _type: 'reference',
            _ref: asset._id
        }
    };
}

async function main() {
    try {
        console.log("Searching for Chocolate & Denim Set...");
        const products = await client.fetch(`*[_type == "product" && title == "Chocolate & Denim Set"]{_id}`);
        
        if (products.length === 0) {
            console.error("Could not find product matching 'Chocolate & Denim Set'");
            return;
        }
        const productId = products[0]._id;

        const baseDir = '/Users/uditsharma/Downloads/colour varient ';
        const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

        const newVariants = [];

        for (const folder of folders) {
            console.log(`\nProcessing folder: ${folder}`);
            const folderPath = path.join(baseDir, folder);
            
            const parsed = parseFolderName(folder);
            const hexes = getHexCodes(parsed.top, parsed.bottom);
            const colorName = parsed.top.charAt(0).toUpperCase() + parsed.top.slice(1);

            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

            const randomFiles = [];
            const setOnlyFiles = [];
            const topOnlyFiles = [];
            const bottomOnlyFiles = [];

            for (const file of files) {
                const lower = file.toLowerCase();
                if (lower.includes('set only')) setOnlyFiles.push(file);
                else if (lower.includes('top only')) topOnlyFiles.push(file);
                else if (lower.includes('bottom only')) bottomOnlyFiles.push(file);
                else randomFiles.push(file);
            }

            // Upload all unique files in this folder
            const uploads: Record<string, any> = {};
            for (const file of files) {
                uploads[file] = await uploadImage(path.join(folderPath, file));
            }

            // Construct arrays
            const setImages = [...randomFiles, ...setOnlyFiles].map(f => uploads[f]);
            const topImages = topOnlyFiles.length > 0 ? [...randomFiles, ...topOnlyFiles].map(f => uploads[f]) : [];
            const bottomImages = bottomOnlyFiles.length > 0 ? [...randomFiles, ...bottomOnlyFiles].map(f => uploads[f]) : [];

            newVariants.push({
                _key: `variant_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                colorName: colorName,
                colorHex: hexes.topHex,
                secondaryColorHex: hexes.bottomHex,
                onlyAvailableAsSet: false, // Wait, if it has no top/bottom images, the frontend filters it anyway!
                stock: 10,
                images: setImages,
                topImages: topImages,
                bottomImages: bottomImages
            });
        }

        console.log(`\nUpdating Sanity with ${newVariants.length} variants...`);
        await client
            .patch(productId)
            .set({ variants: newVariants })
            .commit();

        console.log("Success! Variants have been fully updated.");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
