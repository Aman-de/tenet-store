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
    const map: any = {
        'choclate': '#7B3F00',
        'white': '#FFFFFF',
        'blue': '#3B5998',
        'lightpink': '#FFB6C1',
        'light pink': '#FFB6C1',
        'red': '#8B3A46',
        'yellow': '#D49B2C',
        'light blue': '#A8B8CD'
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
        let chocolateWhiteBottomImage: any = null;
        
        // First pass: upload Choclate White to grab images for the original
        const chocFolder = folders.find(f => f.includes('choclate'));
        if (chocFolder) {
            const folderPath = path.join(baseDir, chocFolder);
            const files = fs.readdirSync(folderPath).filter(f => !f.startsWith('.') && !f.endsWith('.mp4'));
            
            for (const file of files) {
                const lower = file.toLowerCase();
                const uploaded = await uploadImage(path.join(folderPath, file));
                if (lower.includes('set only') || lower.includes('setonly')) chocolateWhiteSetImage = uploaded;
                else if (lower.includes('top only') || lower.includes('toponly')) chocolateWhiteTopImage = uploaded;
                else if (lower.includes('bottom only') || lower.includes('buttom only')) chocolateWhiteBottomImage = uploaded;
            }
        }

        if (originalChocolate) {
            // Restore original images, but replace 3rd image with new set image if available
            const imgs = originalChocolate.images || [];
            if (imgs.length >= 3 && chocolateWhiteSetImage) {
                imgs[2] = chocolateWhiteSetImage;
            }
            originalChocolate.images = imgs;
            originalChocolate.topImages = imgs;
            
            // "for top and buttom currently there no buttom one" 
            // If they mean Chocolate & Denim has no bottom image, use the set image for its bottom!
            originalChocolate.bottomImages = chocolateWhiteSetImage ? [chocolateWhiteSetImage] : [];
            originalChocolate.secondaryColorHex = '#A8B8CD'; // Explicitly add secondaryColorHex!
            
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

            const uploads: any = {};
            for (const file of files) {
                console.log(`Uploading ${file}...`);
                uploads[file] = await uploadImage(path.join(folderPath, file));
            }

            // EXACT INSTRUCTIONS: "put that image alsong with other randome named images on the set"
            const setImages = [...setOnlyFiles, ...randomFiles].map(f => uploads[f]);
            
            // "if some folders don't have buttom only image that means you won't put that folder in buttom option"
            // So NO fallback to setImages!
            const topImages = topOnlyFiles.length > 0 ? [...topOnlyFiles, ...randomFiles].map(f => uploads[f]) : [];
            const bottomImages = bottomOnlyFiles.length > 0 ? [...bottomOnlyFiles, ...randomFiles].map(f => uploads[f]) : [];

            newVariants.push({
                _key: `variant_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                colorName: colorName,
                colorHex: hexes.topHex,
                secondaryColorHex: hexes.bottomHex,
                images: setImages,
                topImages: topImages,
                bottomImages: bottomImages
            });
        }

        await client.patch(productId).set({ variants: newVariants }).commit();
        console.log("Successfully uploaded and patched variants!");
    } catch (e) {
        console.error(e);
    }
}

main();
