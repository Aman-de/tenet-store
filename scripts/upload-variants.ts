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
        'blue': '#3B5998',      // Slightly Brighter Navy Blue
        'lightpink': '#FFB6C1',
        'light pink': '#FFB6C1',
        'red': '#8B3A46',       // Slightly Brighter Burgundy Red
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
    if (parts.length === 2) return { top: parts[0].trim(), bottom: parts[1].trim() };
    if (clean.startsWith('blue light blue')) return { top: 'blue', bottom: 'light blue' };
    if (clean.startsWith('red light blue')) return { top: 'red', bottom: 'light blue' };
    return { top: 'unknown', bottom: 'unknown' };
}

async function uploadImage(filePath: string) {
    const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
        filename: path.basename(filePath)
    });
    return {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
    };
}

async function main() {
    try {
        const products = await client.fetch(`*[_type == "product" && title == "Chocolate & Denim Set"]{_id}`);
        const productId = products[0]._id;

        const history = await client.request({
            uri: `/data/history/${dataset}/documents/${productId}?time=2026-06-25T11:00:00Z`
        });
        
        const oldVariants = history.documents[0]?.variants || [];
        const originalChocolate = oldVariants.find((v: any) => v.colorName === "Chocolate & Denim");
        
        const baseDir = '/Users/uditsharma/Downloads/colour varient ';
        const folders = fs.readdirSync(baseDir).filter(f => fs.statSync(path.join(baseDir, f)).isDirectory());

        const newVariants = [];
        let chocolateWhiteTopImage: any = null;
        let chocolateWhiteSetImage: any = null;
        
        // First pass: upload Choclate White to grab images for the original
        const chocFolder = folders.find(f => f.includes('choclate'));
        if (chocFolder) {
            const folderPath = path.join(baseDir, chocFolder);
            const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.'));
            
            for (const file of files) {
                const lower = file.toLowerCase();
                if (lower.includes('top only')) {
                    chocolateWhiteTopImage = await uploadImage(path.join(folderPath, file));
                }
                if (lower.includes('set only')) {
                    chocolateWhiteSetImage = await uploadImage(path.join(folderPath, file));
                }
            }
        }

        if (originalChocolate) {
            console.log("Restoring original Chocolate & Denim variant...");
            // Secondary Hex
            if (originalChocolate.secondaryColorHex && typeof originalChocolate.secondaryColorHex === 'object') {
                originalChocolate.secondaryColorHex.hex = '#A8B8CD';
            } else {
                originalChocolate.secondaryColorHex = '#A8B8CD';
            }
            
            // "use set only and top only for brown one from the colour variont folder for top and buttom"
            if (chocolateWhiteTopImage && chocolateWhiteSetImage) {
                originalChocolate.topImages = [chocolateWhiteTopImage];
                originalChocolate.bottomImages = [chocolateWhiteSetImage];
                
                // "replace 3rd'd image of product only flat lay with new set only in brown set"
                if (originalChocolate.images && originalChocolate.images.length >= 3) {
                    originalChocolate.images[2] = chocolateWhiteSetImage;
                }
            }
            newVariants.push(originalChocolate);
        }

        for (const folder of folders) {
            console.log(`Processing folder: ${folder}`);
            const folderPath = path.join(baseDir, folder);
            
            const parsed = parseFolderName(folder);
            const hexes = getHexCodes(parsed.top, parsed.bottom);
            let colorName = parsed.top.charAt(0).toUpperCase() + parsed.top.slice(1);
            
            if (folder.includes('choclate')) {
                colorName = 'Chocolate & White';
            } else if (colorName === 'Lightpink') {
                colorName = 'Light Pink';
            }

            const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.') && !f.endsWith('.mp4'));

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

            const uploads: Record<string, any> = {};
            for (const file of files) {
                uploads[file] = await uploadImage(path.join(folderPath, file));
            }

            const setImages = [...setOnlyFiles, ...randomFiles].map(f => uploads[f]);
            
            // Fallback to setImages if no specific top/bottom images are provided
            let topImages = topOnlyFiles.length > 0 ? [...topOnlyFiles, ...randomFiles].map(f => uploads[f]) : [...setImages];
            let bottomImages = bottomOnlyFiles.length > 0 ? [...bottomOnlyFiles, ...randomFiles].map(f => uploads[f]) : [...setImages];

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

        console.log(`Updating Sanity with ${newVariants.length} variants...`);
        await client
            .patch(productId)
            .set({ variants: newVariants })
            .commit();

        console.log("Success! Variants patched correctly.");

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
