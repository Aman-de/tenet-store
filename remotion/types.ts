export interface ProductItem {
    name: string;
    category: string;
    image: string;
    tag?: string;
}

export interface FullSetLook {
    title: string;
    frontImage: string;
    backImage?: string;
    sideImage?: string;
    badge?: string;
}

export interface VideoTheme {
    accentColor?: string;
    secondaryAccent?: string;
    bgGradientStart?: string;
    bgGradientEnd?: string;
}

export interface ProductSetVideoProps {
    brandName?: string;
    collectionName?: string;
    websiteUrl?: string;
    top: ProductItem;
    bottom: ProductItem;
    shoes?: ProductItem;
    fullSet: FullSetLook;
    theme?: VideoTheme;
    ctaText?: string;
    voiceoverTop?: string;
    voiceoverBottom?: string;
    voiceoverShoes?: string;
    voiceoverFull?: string;
    musicTrack?: string;
    topCaption?: string;
    promoCode?: string;
}
