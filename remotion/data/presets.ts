import { ProductSetVideoProps } from "../types";
import { staticFile } from "remotion";

const defaultHeels = {
    name: "Crystal Stiletto Heels",
    category: "Footwear",
    image: staticFile("/images/products/chocolate-set/shoes.png"),
    tag: "+ THESE HEELS",
};

// 1. Chocolate Brown & Denim (Warm Chill R&B Beat)
export const chocolateAndDenimSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "WOMEN'S EDIT",
    websiteUrl: "tenet",
    top: {
        name: "Chocolate Tassel Kurti",
        category: "Tops",
        image: staticFile("/images/products/chocolate-set/top_flat.png"),
        tag: "THIS TOP",
    },
    bottom: {
        name: "Wide-Leg Flared Denim",
        category: "Bottoms",
        image: staticFile("/images/products/chocolate-set/bottom_flat.jpg"),
        tag: "+ THIS DENIM",
    },
    shoes: defaultHeels,
    fullSet: {
        title: "The Full Look",
        frontImage: staticFile("/images/products/chocolate-set/model_front.png"),
        backImage: staticFile("/images/products/chocolate-set/model_back.png"),
        sideImage: staticFile("/images/products/chocolate-set/model_side.png"),
        badge: "THE FIT",
    },
    theme: {
        accentColor: "#E0A96D", // Caramel Gold
        secondaryAccent: "#7DA0CA",
        bgGradientStart: "#0D0A08",
        bgGradientEnd: "#050608",
    },
    voiceoverTop: staticFile("/audio/voiceovers/vo-top-chocolate.mp3"),
    musicTrack: staticFile("/audio/music/music-chocolate-rnb.mp3"),
    topCaption: "Start with this Chocolate Kurti 🤎",
};

// 2. Royal Navy Blue & Denim (Upbeat Fashion House Beat)
export const blueAndDenimSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "WOMEN'S EDIT",
    websiteUrl: "tenet",
    top: {
        name: "Navy Blue Tassel Kurti",
        category: "Tops",
        image: staticFile("/images/products/chocolate-set/blue/top_1.webp"),
        tag: "THIS TOP",
    },
    bottom: {
        name: "Wide-Leg Flared Denim",
        category: "Bottoms",
        image: staticFile("/images/products/chocolate-set/bottom_flat.jpg"),
        tag: "+ THIS DENIM",
    },
    shoes: defaultHeels,
    fullSet: {
        title: "The Full Look",
        frontImage: staticFile("/images/products/chocolate-set/blue/combo_4.webp"),
        backImage: staticFile("/images/products/chocolate-set/blue/combo_2.webp"),
        sideImage: staticFile("/images/products/chocolate-set/blue/combo_3.webp"),
        badge: "THE FIT",
    },
    theme: {
        accentColor: "#6BA4E8", // Azure Blue
        secondaryAccent: "#A3C4F3",
        bgGradientStart: "#080C14",
        bgGradientEnd: "#040508",
    },
    voiceoverTop: staticFile("/audio/voiceovers/vo-top-blue.mp3"),
    musicTrack: staticFile("/audio/music/music-blue-chic.mp3"),
    topCaption: "Start with this Navy Blue Kurti 💙",
};

// 3. Crimson Wine Red & Denim (High-Fashion Trap-Soul Runway Beat)
export const redAndDenimSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "WOMEN'S EDIT",
    websiteUrl: "tenet",
    top: {
        name: "Crimson Red Tassel Kurti",
        category: "Tops",
        image: staticFile("/images/products/chocolate-set/red/top_1.webp"),
        tag: "THIS TOP",
    },
    bottom: {
        name: "Wide-Leg Flared Denim",
        category: "Bottoms",
        image: staticFile("/images/products/chocolate-set/bottom_flat.jpg"),
        tag: "+ THIS DENIM",
    },
    shoes: defaultHeels,
    fullSet: {
        title: "The Full Look",
        frontImage: staticFile("/images/products/chocolate-set/red/combo_4.webp"),
        backImage: staticFile("/images/products/chocolate-set/red/combo_2.webp"),
        sideImage: staticFile("/images/products/chocolate-set/red/combo_3.webp"),
        badge: "THE FIT",
    },
    theme: {
        accentColor: "#E26D7D", // Rose Red
        secondaryAccent: "#F28482",
        bgGradientStart: "#14080A",
        bgGradientEnd: "#080405",
    },
    voiceoverTop: staticFile("/audio/voiceovers/vo-top-red.mp3"),
    musicTrack: staticFile("/audio/music/music-red-vogue.mp3"),
    topCaption: "Start with this Crimson Red Kurti 🍷",
};

// 4. Mustard Gold Yellow & Denim (Sun-Drenched Afro-House Groove)
export const yellowAndDenimSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "WOMEN'S EDIT",
    websiteUrl: "tenet",
    top: {
        name: "Mustard Gold Tassel Kurti",
        category: "Tops",
        image: staticFile("/images/products/chocolate-set/yellow/top_1.webp"),
        tag: "THIS TOP",
    },
    bottom: {
        name: "Wide-Leg Flared Denim",
        category: "Bottoms",
        image: staticFile("/images/products/chocolate-set/bottom_flat.jpg"),
        tag: "+ THIS DENIM",
    },
    shoes: defaultHeels,
    fullSet: {
        title: "The Full Look",
        frontImage: staticFile("/images/products/chocolate-set/yellow/combo_4.webp"),
        backImage: staticFile("/images/products/chocolate-set/yellow/combo_2.webp"),
        sideImage: staticFile("/images/products/chocolate-set/yellow/combo_3.webp"),
        badge: "THE FIT",
    },
    theme: {
        accentColor: "#F4B860", // Warm Gold
        secondaryAccent: "#F7D08A",
        bgGradientStart: "#141008",
        bgGradientEnd: "#080604",
    },
    voiceoverTop: staticFile("/audio/voiceovers/vo-top-yellow.mp3"),
    musicTrack: staticFile("/audio/music/music-yellow-groove.mp3"),
    topCaption: "Start with this Mustard Gold Kurti 💛",
};

// 5. Blush Light Pink & Denim (Dreamy Y2K Pop Melodic Beat)
export const pinkAndDenimSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "WOMEN'S EDIT",
    websiteUrl: "tenet",
    top: {
        name: "Blush Pink Tassel Kurti",
        category: "Tops",
        image: staticFile("/images/products/chocolate-set/light-pink/top_1.webp"),
        tag: "THIS TOP",
    },
    bottom: {
        name: "Wide-Leg Flared Denim",
        category: "Bottoms",
        image: staticFile("/images/products/chocolate-set/bottom_flat.jpg"),
        tag: "+ THIS DENIM",
    },
    shoes: defaultHeels,
    fullSet: {
        title: "The Full Look",
        frontImage: staticFile("/images/products/chocolate-set/light-pink/combo_4.webp"),
        backImage: staticFile("/images/products/chocolate-set/light-pink/combo_2.webp"),
        sideImage: staticFile("/images/products/chocolate-set/light-pink/combo_3.webp"),
        badge: "THE FIT",
    },
    theme: {
        accentColor: "#F3A6B2", // Soft Rose Pink
        secondaryAccent: "#FFD6DC",
        bgGradientStart: "#140A0D",
        bgGradientEnd: "#080406",
    },
    voiceoverTop: staticFile("/audio/voiceovers/vo-top-pink.mp3"),
    musicTrack: staticFile("/audio/music/music-pink-dream.mp3"),
    topCaption: "Start with this Blush Pink Kurti 🌸",
};

// 6. Women's Heritage Knitwear Set (Quiet Luxury Cozy Autumn Fit)
export const womensKnitwearSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "WOMEN'S EDIT",
    websiteUrl: "tenet",
    top: {
        name: "Luxury Silk Trench",
        category: "Outerwear",
        image: staticFile("/images/categories/outerwear-woman.webp"),
        tag: "THIS SILK TRENCH",
    },
    bottom: {
        name: "Pleated Wool Trousers",
        category: "Trousers",
        image: staticFile("/images/categories/trousers-woman.webp"),
        tag: "+ THESE TROUSERS",
    },
    shoes: {
        name: "Minimalist Slide Heels",
        category: "Footwear",
        image: staticFile("/images/categories/footwear-woman.jpg"),
        tag: "+ THESE HEELS",
    },
    fullSet: {
        title: "The Full Look",
        frontImage: staticFile("/images/editorial_campaign_women.webp"),
        backImage: staticFile("/images/hero-women.webp"),
        sideImage: staticFile("/images/hero-women1.webp"),
        badge: "THE FIT",
    },
    theme: {
        accentColor: "#E0A96D",
        secondaryAccent: "#C2A68C",
        bgGradientStart: "#14100D",
        bgGradientEnd: "#080605",
    },
    voiceoverTop: staticFile("/audio/voiceovers/vo-knit-top.mp3"),
    voiceoverBottom: staticFile("/audio/voiceovers/vo-knit-bottom.mp3"),
    voiceoverShoes: staticFile("/audio/voiceovers/vo-knit-shoes.mp3"),
    voiceoverFull: staticFile("/audio/voiceovers/vo-knit-full.mp3"),
    musicTrack: staticFile("/audio/music/music-chocolate-rnb.mp3"),
    topCaption: "Start with our Luxury Trench 🤎",
};

// 7. Women's Resort Linen Set (Coastal Vacation Chic)
export const womensResortLinenSet: ProductSetVideoProps = {
    brandName: "TENET",
    collectionName: "WOMEN'S EDIT",
    websiteUrl: "tenet",
    top: {
        name: "Riviera Linen Shirt",
        category: "Shirting",
        image: staticFile("/images/categories/shirting-woman.webp"),
        tag: "THIS LINEN SHIRT",
    },
    bottom: {
        name: "Wide-Leg Linen Pants",
        category: "Pants",
        image: staticFile("/images/categories/pants-woman.webp"),
        tag: "+ THESE PANTS",
    },
    shoes: {
        name: "Minimalist Slide Heels",
        category: "Footwear",
        image: staticFile("/images/categories/footwear-woman.jpg"),
        tag: "+ THESE HEELS",
    },
    fullSet: {
        title: "The Full Look",
        frontImage: staticFile("/images/hero-women1.webp"),
        backImage: staticFile("/images/categories/sets-woman.webp"),
        sideImage: staticFile("/images/categories/lounge-woman.webp"),
        badge: "THE FIT",
    },
    theme: {
        accentColor: "#F4B860",
        secondaryAccent: "#7DA0CA",
        bgGradientStart: "#1A150E",
        bgGradientEnd: "#0A0805",
    },
    voiceoverTop: staticFile("/audio/voiceovers/vo-linen-top.mp3"),
    voiceoverBottom: staticFile("/audio/voiceovers/vo-linen-bottom.mp3"),
    voiceoverShoes: staticFile("/audio/voiceovers/vo-linen-shoes.mp3"),
    voiceoverFull: staticFile("/audio/voiceovers/vo-linen-full.mp3"),
    musicTrack: staticFile("/audio/music/music-yellow-groove.mp3"),
    topCaption: "Start with this Riviera Linen Shirt ☀️",
};

export const presets = {
    chocolateAndDenim: chocolateAndDenimSet,
    blueAndDenim: blueAndDenimSet,
    redAndDenim: redAndDenimSet,
    yellowAndDenim: yellowAndDenimSet,
    pinkAndDenim: pinkAndDenimSet,
    womensKnitwear: womensKnitwearSet,
    womensResortLinen: womensResortLinenSet,
};
