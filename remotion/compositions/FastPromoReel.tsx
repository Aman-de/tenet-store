import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ProductSetVideoProps } from "../types";
import { Background } from "../components/Background";
import { BrandHeader } from "../components/BrandHeader";
import { TopScene } from "../components/TopScene";
import { BottomScene } from "../components/BottomScene";
import { FullLookScene } from "../components/FullLookScene";
import { OutroScene } from "../components/OutroScene";
import "../styles/remotion.css";

export const FastPromoReel: React.FC<ProductSetVideoProps> = ({
    brandName = "TENET",
    collectionName = "NEW ARRIVAL",
    websiteUrl = "tenet.store",
    top,
    bottom,
    fullSet,
    theme = {},
    ctaText = "SHOP THE SET",
    promoCode = "SETLOOK",
}) => {
    const accentColor = theme.accentColor || "#D4AF37";
    const secondaryAccent = theme.secondaryAccent || "#B45309";
    const bgGradientStart = theme.bgGradientStart || "#0D0A08";
    const bgGradientEnd = theme.bgGradientEnd || "#05070B";

    return (
        <AbsoluteFill style={{ backgroundColor: bgGradientStart, overflow: "hidden" }}>
            <Background
                bgStart={bgGradientStart}
                bgEnd={bgGradientEnd}
                accentColor={accentColor}
                secondaryAccent={secondaryAccent}
            />

            <Sequence from={0} durationInFrames={140}>
                <BrandHeader
                    brandName={brandName}
                    collectionName={collectionName}
                    accentColor={accentColor}
                />
            </Sequence>

            {/* Quick Top Scene (0 - 45 frames / 1.5s) */}
            <Sequence from={0} durationInFrames={45}>
                <TopScene top={top} accentColor={accentColor} />
            </Sequence>

            {/* Quick Bottom Scene (40 - 85 frames / 1.5s) */}
            <Sequence from={40} durationInFrames={45}>
                <BottomScene
                    bottom={bottom}
                    accentColor={accentColor}
                />
            </Sequence>

            {/* Quick Full Set Reveal (80 - 135 frames / 1.8s) */}
            <Sequence from={80} durationInFrames={55}>
                <FullLookScene fullSet={fullSet} accentColor={accentColor} />
            </Sequence>

            {/* Outro (130 - 180 frames / 1.7s) */}
            <Sequence from={130} durationInFrames={50}>
                <OutroScene
                    brandName={brandName}
                    websiteUrl={websiteUrl}
                    ctaText={ctaText}
                    promoCode={promoCode}
                    accentColor={accentColor}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
