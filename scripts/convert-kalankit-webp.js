const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootSource = "/Users/amansharma/Downloads/Kalankit Rakhi Gift Hamper For Sister _ Rakhi Gift For Girls, Sling Bag For Women, Travel Crossbody Bags, Stylish Cross Sling Bags for Woman _ Rakhi Gifts For Sister, Gifts for Rakshabandhan _ Amazon.in_ Fashion";
const sub1Source = path.join(rootSource, "Buy Kalankit Rakhi Gift Hamper For Sister, Rakhi Gift For Sister _ Crossbody Sling Bag For Women _ Cute Birthday Gift For Teenage Girls, Rakshabandhan Gifts, Gifts For Girls On Rakhi at Amazon.in");
const sub2Source = path.join(rootSource, "Kalankit Rakhi Gifts For Sister _ Rakhi Gift Hamper For Sister, Sling Bag For Women, Travel Crossbody Bags, Stylish Cross Sling Bags _ Gift For Rakhi For Women, Rakshabandhan Gifts For Girls _ Amazon.in_ Fashion");

const targetBase = path.join(__dirname, "../public/images/products/kalankit");
const v1Target = path.join(targetBase, "variant-1");
const v2Target = path.join(targetBase, "variant-2");
const v3Target = path.join(targetBase, "variant-3");
const reviewsTarget = path.join(targetBase, "reviews");

// Reset and create directories
[targetBase, v1Target, v2Target, v3Target, reviewsTarget].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Remove existing files in target directories
[v1Target, v2Target, v3Target, reviewsTarget].forEach(dir => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        fs.unlinkSync(path.join(dir, file));
    }
});

async function processFolder(sourceDir, targetDir, variantPrefix) {
    const files = fs.readdirSync(sourceDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.webp'));
    
    let productIdx = 1;
    let reviewIdx = 1;
    
    for (const file of files) {
        const fullPath = path.join(sourceDir, file);
        const isReview = file.toLowerCase().includes('review');
        
        let outName;
        let destFolder;
        
        if (isReview) {
            outName = `kalankit-review-${variantPrefix}-${reviewIdx++}.webp`;
            destFolder = reviewsTarget;
        } else {
            outName = `${variantPrefix}-img-${productIdx++}.webp`;
            destFolder = targetDir;
        }
        
        const destPath = path.join(destFolder, outName);
        console.log(`Converting ${file} -> ${path.relative(targetBase, destPath)}`);
        
        await sharp(fullPath)
            .webp({ quality: 88 })
            .toFile(destPath);
    }
}

async function run() {
    console.log("Processing Variant 1 (Root)...");
    await processFolder(rootSource, v1Target, "v1");
    
    console.log("Processing Variant 2 (Subfolder 1)...");
    await processFolder(sub1Source, v2Target, "v2");
    
    console.log("Processing Variant 3 (Subfolder 2)...");
    await processFolder(sub2Source, v3Target, "v3");
    
    console.log("\nReview Files created:");
    console.log(fs.readdirSync(reviewsTarget));
    
    console.log("\nVariant 1 Files:");
    console.log(fs.readdirSync(v1Target));
    
    console.log("\nVariant 2 Files:");
    console.log(fs.readdirSync(v2Target));
    
    console.log("\nVariant 3 Files:");
    console.log(fs.readdirSync(v3Target));
}

run().catch(console.error);
