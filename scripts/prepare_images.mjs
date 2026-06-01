import fs from 'fs';
import path from 'path';
import https from 'https';

const PROJECT_ID = '9zyx0aef';
const DATASET = 'production';
const API_VERSION = '2026-01-22';
const QUERY = encodeURIComponent('*[_type == "product"]{ title, "imageUrl": variants[0].images[0].asset->url }');
const URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${QUERY}`;

const targets = [
    "The Archive Cable Knit Zip",
    "The Tailored Gurkha Trouser",
    "The Canvas Chore Coat",
    "The Voyager Leather Duffel",
    "The Heritage Chronograph",
    "Essential Heavyweight Tee",
    "The Merino Crewneck",
    "The Weekender",
    "The Pleated Wool Trouser",
    "The Hamptons Weekend Edit",
    "The Riviera Linen Short",
    "The Essential Jogger",
    "The Heavyweight Hoodie",
    "The Amalfi Stripe",
    "The Harbour Stripe Swim",
    "The Sterling Cashmere Vest",
    "The Mediterranean Retreat Edit",
    "The Textured Knit Polo",
    "The Desert Boot",
    "The Heritage Cable Knit",
    "The Bridle Leather Belt"
];

const targetSet = new Set(targets.map(t => t.toLowerCase()));

const scratchDir = path.join(process.cwd(), 'scratch', 'reference_images');
if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    console.log(`Fetching products from: ${URL}`);
    try {
        const response = await fetch(URL);
        const data = await response.json();
        
        const products = data.result || [];
        console.log(`Found ${products.length} total products.`);
        
        for (const p of products) {
            const titleLow = (p.title || '').toLowerCase();
            const matched = targets.find(t => t.toLowerCase() === titleLow);
            
            if (matched && p.imageUrl) {
                const safeName = matched.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const ext = path.extname(new URL(p.imageUrl).pathname) || '.jpg';
                const destPath = path.join(scratchDir, `${safeName}${ext}`);
                
                console.log(`Downloading ${matched} -> ${destPath}`);
                await downloadImage(p.imageUrl, destPath);
            } else if (matched && !p.imageUrl) {
                console.log(`Missing image for ${matched}`);
            }
        }
        
        console.log("Done downloading reference images.");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
