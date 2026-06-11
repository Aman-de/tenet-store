const fs = require('fs');
const https = require('https');
const path = require('path');

const CATEGORY_IMAGES = {
    knitwear: {
        man: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1024",
        woman: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1024"
    },
    accessories: {
        man: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/631cae490b81cba20ad3bde888e83f8a9437522a-1024x1024.webp"
    },
    shirts: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/8164623b78c4f923de6713c2f0c580e71acdccc9-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/785069aedf180182e39693484ad92b0c10acd092-1024x1024.webp"
    },
    jackets: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/d2c8d62d29da7a292041906aef8baf0ec4052676-640x640.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/5b5c0311f171c46cb66515c24304b7e61f48bd1e-640x640.webp"
    },
    footwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/b87b417450fae7281a6b41ead55e74f43c897fb7-1024x1024.webp",
        woman: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1024"
    },
    outerwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/7dc9cb85576054710c3cf2d7c05878b97c6c3eb2-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/5437d499c94607847f4aec1971df6cc28312d366-1125x1688.webp"
    },
    trousers: {
        man: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/86589d169a8de56c24f78ce765ceffc7eeba5419-1125x1688.webp"
    },
    pants: {
        man: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/86589d169a8de56c24f78ce765ceffc7eeba5419-1125x1688.webp"
    },
    swimwear: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/85949fe7c5800a01a9ba444f84e20b5f1c6590e4-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/85949fe7c5800a01a9ba444f84e20b5f1c6590e4-1024x1024.webp"
    },
    sets: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/04767c2b24c268b17549176dd331fdac21ab55fd-640x640.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/779ef235f4592467c99bde5ef7774e73f4334d80-1024x1024.webp"
    },
    shirting: {
        man: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1024",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/9a82a1bf981d5953889bd0bcc093e21ffef7d645-800x1000.webp"
    },
    lounge: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/c1363a27626d89034b79adc7d043c505ce39910e-1024x1024.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/5f86d7ffaa9f8beae1acda5d56713544228e9635-800x1000.webp"
    },
    shorts: {
        man: "https://cdn.sanity.io/images/9zyx0aef/production/e2c3ba688850b272c1c51d6809e1781b26caf163-640x640.webp",
        woman: "https://cdn.sanity.io/images/9zyx0aef/production/11a3669561183f64048557a9a53a465f858dbedd-640x640.webp"
    }
};

const dir = path.join(__dirname, 'public', 'images', 'categories');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function download(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.log('Failed:', url);
                resolve(); // skip
                return;
            }
            const writeStream = fs.createWriteStream(filepath);
            res.pipe(writeStream);
            writeStream.on('finish', () => {
                writeStream.close();
                console.log('Downloaded:', filepath);
                resolve();
            });
        }).on('error', (err) => {
            console.log('Error downloading', url, err);
            resolve();
        });
    });
}

async function run() {
    for (const [category, genders] of Object.entries(CATEGORY_IMAGES)) {
        for (const [gender, url] of Object.entries(genders)) {
            const ext = url.includes('.webp') ? '.webp' : '.jpg';
            const filepath = path.join(dir, `${category}-${gender}${ext}`);
            await download(url, filepath);
        }
    }
}

run();
