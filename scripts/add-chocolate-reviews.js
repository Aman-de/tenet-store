require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
    projectId: '9zyx0aef',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-05-24'
});

const productId = "QVtslAxAiovrz0zSDBgiOQ"; // Chocolate Set
const imagePaths = [
    "/Users/uditsharma/.gemini/antigravity/brain/7b120e1e-ec1a-4f91-8002-8e8f600b6ac1/chocolate_set_review_1_1780642760712.png",
    "/Users/uditsharma/.gemini/antigravity/brain/7b120e1e-ec1a-4f91-8002-8e8f600b6ac1/chocolate_set_review_2_1780642776164.png"
];

const reviews = [
    { author: "Priya S.", rating: 5, comment: "Bhai kya mast set hai, fitting ekdum perfect aayi. Fabric bhi bahut soft hai." },
    { author: "Ananya M.", rating: 5, comment: "Loved it! Colour same as picture hai, bilkul bhi dull nahi lag raha." },
    { author: "Sneha R.", rating: 4, comment: "Quality is top notch. Thoda sa price high hai par worth it laga mujhe." },
    { author: "Ritika D.", rating: 5, comment: "Super elegant! Pehanne ke baad bahut classy look de raha hai." },
    { author: "Pooja V.", rating: 5, comment: "Mere husband ne mujhe gift kiya tha, I am totally in love with this color." },
    { author: "Simran K.", rating: 4, comment: "Acha hai, par delivery me 4 din lag gaye. Product wise koi shikayat nahi." },
    { author: "Neha B.", rating: 5, comment: "Best purchase so far. Friends bhi pooch rahi thi kahan se liya." },
    { author: "Kriti T.", rating: 5, comment: "Material sach me premium feel deta hai. Main definitely aur order karungi." },
    { author: "Meghna P.", rating: 4, comment: "Looking gorgeous! Size guide follow kiya tha toh sahi aaya." },
    { author: "Aarti J.", rating: 5, comment: "Ekdum saste me itna luxurious feel milega socha nahi tha. Great job Tenet!" },
    { author: "Divya N.", rating: 5, comment: "Fabric itna breathable hai ki garmi me bhi aaram se pehan sakte hain." },
    { author: "Shivani G.", rating: 4, comment: "Design bahut unique hai, but I wish aur colors me bhi available hota." },
    { author: "Kavya L.", rating: 5, comment: "Pehli baar try kiya is brand se and I'm very impressed with the quality." },
    { author: "Tanya C.", rating: 5, comment: "Absolutely stunning! Fit itna acha hai jaise custom tailor karwaya ho." },
    { author: "Sakshi H.", rating: 4, comment: "Overall acha hai but thoda stretchable hota toh aur better rehta." },
    { author: "Nisha M.", rating: 5, comment: "Bahut sundar lag raha hai. I wore it to a party and got so many compliments." },
    { author: "Garima S.", rating: 5, comment: "Worth every penny. Yeh mera naya favourite outfit ban gaya hai." },
    { author: "Sonam W.", rating: 4, comment: "Thoda loose tha par alter karwa liya, ab ekdum perfect hai." },
    { author: "Riya K.", rating: 5, comment: "Color combo is just wow. Chocolate brown is definitely my new aesthetic." },
    { author: "Anjali P.", rating: 5, comment: "Simple yet so elegant. Fabric ki sheen sach me premium lagti hai." },
    { author: "Khushi V.", rating: 4, comment: "Delivery fast thi. Product is also good but packaging could be better." },
    { author: "Shruti D.", rating: 5, comment: "I highly recommend this. Photos me jaisa dikhta hai, real me usse bhi acha hai." },
    { author: "Pallavi B.", rating: 5, comment: "Ekdum comfortable and stylish. Perfect for casual outings ya office." },
    { author: "Swati M.", rating: 5, comment: "Quality ke hisaab se price bahut reasonable hai. Love it!" },
    { author: "Ishita R.", rating: 4, comment: "Acha product hai, fabric thoda thick hai toh winters me bhi chal jayega." },
    { author: "Deepa S.", rating: 5, comment: "Main toh fan ho gayi iski. I will buy another one in a different style." },
    { author: "Roshni K.", rating: 5, comment: "Beautiful set! Fabric itna smooth hai skin par, it feels luxurious." },
    { author: "Nandini J.", rating: 4, comment: "Design acha hai, aur fitting bhi thik thak hai mere hisaab se." },
    { author: "Shweta T.", rating: 5, comment: "My new go-to outfit! Itna versatile hai ki kahin bhi pehan sakte ho." },
    { author: "Ayesha S.", rating: 5, comment: "Very nice! Material is totally high end. Sab pooch rahe the kahan se liya." }
];

async function addReviews() {
    try {
        console.log("Uploading images...");
        const asset1 = await client.assets.upload('image', fs.createReadStream(imagePaths[0]), { filename: 'review_1.png' });
        const asset2 = await client.assets.upload('image', fs.createReadStream(imagePaths[1]), { filename: 'review_2.png' });
        console.log("Uploaded images:", asset1._id, asset2._id);

        console.log("Creating reviews...");
        for (let i = 0; i < reviews.length; i++) {
            const r = reviews[i];
            
            const reviewDoc = {
                _type: 'review',
                product: {
                    _type: 'reference',
                    _ref: productId
                },
                author: r.author,
                rating: r.rating,
                comment: r.comment,
                status: 'Approved',
                images: []
            };

            // Add images to the first two reviews
            if (i === 0) {
                reviewDoc.images.push({ _type: 'image', asset: { _type: 'reference', _ref: asset1._id } });
            } else if (i === 1) {
                reviewDoc.images.push({ _type: 'image', asset: { _type: 'reference', _ref: asset2._id } });
            }

            await client.create(reviewDoc);
            console.log(`Created review ${i+1}/${reviews.length}`);
            
            // Wait 200ms between requests to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log("All reviews added successfully!");
    } catch (err) {
        console.error("Error:", err);
    }
}

addReviews();
