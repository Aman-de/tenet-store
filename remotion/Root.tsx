import React from "react";
import { Composition } from "remotion";
import { MasterViralReel } from "./compositions/MasterViralReel";
import { RakhiCommercialPromoReel } from "./compositions/RakhiCommercialPromoReel";
import { BottomBattleReel } from "./compositions/BottomBattleReel";
import { AllColorsShowdownReel } from "./compositions/AllColorsShowdownReel";
import { DayVsNightReel } from "./compositions/DayVsNightReel";
import { ThreeWayOutfitBattleReel } from "./compositions/ThreeWayOutfitBattleReel";
import { ColorBattleReel } from "./compositions/ColorBattleReel";
import { ThisOrThatReel } from "./compositions/ThisOrThatReel";
import { POVOutfitReel } from "./compositions/POVOutfitReel";
import { ProductSetReel } from "./compositions/ProductSetReel";
import {
    chocolateAndDenimSet,
    blueAndDenimSet,
    redAndDenimSet,
    yellowAndDenimSet,
    pinkAndDenimSet,
    womensKnitwearSet,
    womensResortLinenSet,
} from "./data/presets";
import { ProductSetVideoProps } from "./types";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* ============================================================ */}
            {/* 👑 FLAGSHIP MASTER VIRAL REEL (295 frames / 9.83s @ 30fps)   */}
            {/* ============================================================ */}
            {/* ============================================================ */}
            {/* 🪢 RAKHI COMMERCIAL PROMO REEL (1195 frames / 39.83s @ 30fps) */}
            {/* ============================================================ */}
            <Composition
                id="RakhiCommercialPromoReel"
                component={RakhiCommercialPromoReel}
                durationInFrames={1195}
                fps={30}
                width={1080}
                height={1920}
            />

            <Composition
                id="MasterViralReel"
                component={MasterViralReel}
                durationInFrames={295}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* ============================================================ */}
            {/* 👖 BOTTOM BATTLE REEL (350 frames / 11.66s @ 30fps)          */}
            {/* ============================================================ */}
            <Composition
                id="BottomBattleReel"
                component={BottomBattleReel}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* ============================================================ */}
            {/* 🌈 ALL 5 COLORS SHOWDOWN REEL (520 frames / 17.33s @ 30fps)  */}
            {/* ============================================================ */}
            <Composition
                id="AllColorsShowdownReel"
                component={AllColorsShowdownReel}
                durationInFrames={520}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* ============================================================ */}
            {/* ✨ TWO ICONIC LOOKS REEL (540 frames / 18.0s @ 30fps)        */}
            {/* ============================================================ */}
            <Composition
                id="DayVsNightReel"
                component={DayVsNightReel}
                durationInFrames={540}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* ============================================================ */}
            {/* 🔥 3-WAY OUTFIT BATTLE REEL (620 frames / 20.66s @ 30fps)    */}
            {/* ============================================================ */}
            <Composition
                id="ThreeWayOutfitBattleReel"
                component={ThreeWayOutfitBattleReel}
                durationInFrames={620}
                fps={30}
                width={1080}
                height={1920}
            />

            {/* ============================================================ */}
            {/* 👗 OUTFIT BUILDER REELS (350 frames / 11.66s @ 30fps)        */}
            {/* ============================================================ */}
            <Composition
                id="ChocolateAndDenimSet"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={chocolateAndDenimSet}
            />
            <Composition
                id="BlueAndDenimSet"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={blueAndDenimSet}
            />
            <Composition
                id="RedAndDenimSet"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={redAndDenimSet}
            />
            <Composition
                id="YellowAndDenimSet"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={yellowAndDenimSet}
            />
            <Composition
                id="PinkAndDenimSet"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={pinkAndDenimSet}
            />
            <Composition
                id="WomensKnitwearSet"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={womensKnitwearSet}
            />
            <Composition
                id="WomensResortLinenSet"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={womensResortLinenSet}
            />
            <Composition
                id="ProductSetReel"
                component={ProductSetReel as any}
                durationInFrames={350}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={chocolateAndDenimSet}
            />

            <Composition
                id="ColorBattleReel"
                component={ColorBattleReel}
                durationInFrames={165}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="ThisOrThatReel"
                component={ThisOrThatReel}
                durationInFrames={165}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="POVOutfitReel"
                component={POVOutfitReel}
                durationInFrames={165}
                fps={30}
                width={1080}
                height={1920}
            />
        </>
    );
};
