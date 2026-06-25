import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId } from '../sanity/env';
import fs from 'fs';
import path from 'path';

const token = process.env.SANITY_API_TOKEN;

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
        'blue': '#242C44',      // Navy Blue
        'lightpink': '#FFB6C1',
        'light pink': '#FFB6C1',
        'red': '#6B2D36',       // Deep Burgundy Red
        'yellow': '#D49B2C',    // Mustard Yellow
        'light blue': '#A8B8CD' // Silvery blue
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
        const productId = products[0]._id;

        // Fetch original Chocolate & Denim variant from history
        const history = await client.request({
            uri: `/data/history/${dataset}/documents/${productId}?time=2026-06-25T11:00:00Z`
        });
        
        const oldVariants = history.documents[0]?.variants || [];
        const originalChocolate = oldVariants.find((v: any) => v.colorName === "Chocolate & Denim");
        
        if (originalChocolate) {
            // Update its secondary hex to the new light blue so they all match
            if (originalChocolate.secondaryColorHex && typeof originalChocolate.secondaryColorHex === 'object') {
                originalChocolate.secondaryColorHex.hex = '#A8B8CD';
            } else {
                originalChocolate.secondaryColorHex = '#A8B8CD';
            }
        }

        const baseDir = '/Users/uditsharma/Downloads/colour varient ';
        const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

        const newVariants = [];

        // Put original chocolate variant first if it exists
        if (originalChocolate) {
            console.log("Found original Chocolate variant from history, restoring it...");
            newVariants.push(originalChocolate);
        }

        for (const folder of folders) {
            console.log(`\nProcessing folder: ${folder}`);
            const folderPath = path.join(baseDir, folder);
            
            const parsed = parseFolderName(folder);
            const hexes = getHexCodes(parsed.top, parsed.bottom);
            let colorName = parsed.top.charAt(0).toUpperCase() + parsed.top.slice(1);
            
            // Format specific color names nicely
            if (folder.includes('choclate')) {
                colorName = 'Chocolate & White';
            } else if (colorName === 'Lightpink') {
                colorName = 'Light Pink';
            }

            const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

            const randomFiles = [];
            const setOnlyFiles = [];
            const topOnlyFiles = [];
            const bottomOnlyFiles = [];

            for (const file of files) {
                const lower = file.toLowerCase();
                if (lower.includes('set only') || lower.includes('setonly')) setOnlyFiles.push(file);
                else if (lower.includes('top only') || lower.includes('toponly')) topOnlyFiles.push(file);
                else if (lower.includes('bottom only') || lower.includes('buttom only')) bottomOnlyFiles.push(file);
                else randomFiles.push(file);
            }

            // Upload all unique files in this folder
            const uploads: Record<string, any> = {};
            for (const file of files) {
                uploads[file] = await uploadImage(path.join(folderPath, file));
            }

            // Construct arrays with labeled images FIRST
            const setImages = [...setOnlyFiles, ...randomFiles].map(f => uploads[f]);
            const topImages = topOnlyFiles.length > 0 ? [...topOnlyFiles, ...randomFiles].map(f => uploads[f]) : [];
            const bottomImages = bottomOnlyFiles.length > 0 ? [...bottomOnlyFiles, ...randomFiles].map(f => uploads[f]) : [];

            newVariants.push({
                _key: `variant_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                colorName: colorName,
                colorHex: hexes.topHex,
                secondaryColorHex: hexes.bottomHex,
                onlyAvailableAsSet: false, 
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
