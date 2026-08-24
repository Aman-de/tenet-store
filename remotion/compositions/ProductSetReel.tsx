import React from "react";
import {
    AbsoluteFill,
    Audio,
    Img,
    interpolate,
    Sequence,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { ProductSetVideoProps } from "../types";
import { ConversionOverlay } from "../components/ConversionOverlay";
import "../styles/remotion.css";

// =======================================================
// ITEM SHOWCASE SCENE (With Dynamic Animated Top Header)
// =======================================================
interface ItemSceneProps {
    title: string;
    badgeText: string;
    imageSrc: string;
    accentColor: string;
    bgGradient: string;
    durationInFrames: number;
}

const SingleItemScene: React.FC<ItemSceneProps> = ({
    title,
    badgeText,
    imageSrc,
    accentColor,
    bgGradient,
    durationInFrames,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 150 },
    });

    const cardScale = interpolate(frame, [0, durationInFrames], [1.04, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Background Ambient Gradient */}
            <div style={{ position: "absolute", inset: 0, background: bgGradient }} />

            {/* Top Animated Header & Keyword Badge (Safe Zone: Y = 110px) */}
            <div
                style={{
                    position: "absolute",
                    top: 115,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transform: `translateY(${(1 - entrance) * -18}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                {/* Glowing Keyword Badge */}
                <div
                    style={{
                        padding: "5px 18px",
                        borderRadius: 99,
                        background: `${accentColor}22`,
                        border: `1px solid ${accentColor}66`,
                        boxShadow: `0 4px 20px ${accentColor}33`,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        color: accentColor,
                        textTransform: "uppercase",
                    }}
                >
                    {badgeText}
                </div>

                {/* Main Item Title */}
                <div
                    style={{
                        padding: "8px 26px",
                        borderRadius: 99,
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 36,
                            fontWeight: 700,
                            color: "#FFFFFF",
                            margin: 0,
                            letterSpacing: "0.02em",
                            textShadow: "0 2px 15px rgba(0,0,0,0.8)",
                        }}
                    >
                        {title}
                    </h2>
                </div>
            </div>

            {/* Centered Luxury Card with Spring Zoom */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 70,
                    right: 70,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    boxShadow: `0 25px 60px rgba(0,0,0,0.8), 0 0 30px ${accentColor}18`,
                    border: `2px solid ${accentColor}44`,
                    transform: `scale(${cardScale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(18, 15, 13, 0.6)",
                }}
            >
                <Img
                    src={imageSrc}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Sleek Bottom Conversion Pill */}
            <ConversionOverlay
                accentColor={accentColor}
                ctaPillText='Comment "LINK" for DM ✨'
            />
        </AbsoluteFill>
    );
};

// =======================================================
// FULL LOOK MULTI-ANGLE ON-MODEL SHOWCASE
// =======================================================
interface FullLookSceneProps {
    frontImg: string;
    backImg?: string;
    sideImg?: string;
    accentColor: string;
}

const FullLookScene: React.FC<FullLookSceneProps> = ({
    frontImg,
    backImg,
    sideImg,
    accentColor,
}) => {
    const frame = useCurrentFrame();

    let currentImage = frontImg;
    let badgeText = "FRONT VIEW ✨";
    let subFrame = frame;

    if (frame < 50) {
        currentImage = frontImg;
        badgeText = "FRONT VIEW ✨";
        subFrame = frame;
    } else if (frame < 100) {
        currentImage = backImg || frontImg;
        badgeText = "BACK DETAIL 💫";
        subFrame = frame - 50;
    } else {
        currentImage = sideImg || frontImg;
        badgeText = "SIDE SLIT 👑";
        subFrame = frame - 100;
    }

    const scale = interpolate(subFrame, [0, 50], [1.03, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Top Animated Header */}
            <div
                style={{
                    position: "absolute",
                    top: 115,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "5px 18px",
                        borderRadius: 99,
                        background: `${accentColor}22`,
                        border: `1px solid ${accentColor}66`,
                        boxShadow: `0 4px 20px ${accentColor}33`,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        color: accentColor,
                        textTransform: "uppercase",
                    }}
                >
                    {badgeText}
                </div>

                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    The Full Fit ✨
                </h1>
            </div>

            {/* Centered Image Card */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 70,
                    right: 70,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    border: `2px solid ${accentColor}55`,
                    transform: `scale(${scale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={currentImage}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Bottom Conversion Pill */}
            <ConversionOverlay
                accentColor={accentColor}
                ctaPillText='Comment "LINK" for DM ✨'
            />
        </AbsoluteFill>
    );
};

// =======================================================
// MASTER PRODUCT SET COMPOSITION
// =======================================================
export const ProductSetReel: React.FC<ProductSetVideoProps> = ({
    top,
    bottom,
    shoes,
    fullSet,
    theme,
    voiceoverTop,
    voiceoverBottom,
    voiceoverShoes,
    voiceoverFull,
    musicTrack,
    topCaption,
}) => {
    const accentColor = theme?.accentColor || "#E0A96D";
    const bgStart = theme?.bgGradientStart || "#100D0A";
    const bgEnd = theme?.bgGradientEnd || "#060504";
    const bgGradient = `radial-gradient(circle at 50% 50%, ${bgStart} 0%, ${bgEnd} 80%)`;
    const defaultShoesImg = staticFile("/images/products/chocolate-set/shoes.png");
    const shoesImg = shoes?.image || defaultShoesImg;
    const topVo = voiceoverTop || staticFile("/audio/voiceovers/vo-top.mp3");
    const bottomVo = voiceoverBottom || staticFile("/audio/voiceovers/vo-denim.mp3");
    const shoesVo = voiceoverShoes || staticFile("/audio/voiceovers/vo-heels.mp3");
    const fullVo = voiceoverFull || staticFile("/audio/voiceovers/vo-fit.mp3");
    const music = musicTrack || staticFile("/audio/music/music-chocolate-rnb.mp3");

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* 1. Subtle Background Music (Lowered to 0.18 for vocal prominence) */}
            <Audio src={music} volume={0.18} />

            {/* 2. Synchronized AI Female Neural Voiceover Clips (Crisp at 1.0) */}
            <Sequence from={6}>
                <Audio src={topVo} volume={1.0} />
            </Sequence>

            <Sequence from={74}>
                <Audio src={bottomVo} volume={1.0} />
            </Sequence>

            <Sequence from={139}>
                <Audio src={shoesVo} volume={1.0} />
            </Sequence>

            <Sequence from={209}>
                <Audio src={fullVo} volume={1.0} />
            </Sequence>

            <Sequence from={270}>
                <Audio src={staticFile("/audio/voiceovers/vo-cta-link.mp3")} volume={1.0} />
            </Sequence>

            {/* 3. Synced SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={70} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={135} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={205} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.45} />
            </Sequence>
            <Sequence from={205} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.45} />
            </Sequence>
            <Sequence from={255} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.45} />
            </Sequence>
            <Sequence from={305} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.45} />
            </Sequence>

            {/* ============================================== */}
            {/* VISUAL TIMELINE                                */}
            {/* ============================================== */}

            {/* Beat 1: THIS TOP (0 - 70 frames / 2.33s) */}
            <Sequence from={0} durationInFrames={70}>
                <SingleItemScene
                    title="THIS TOP"
                    badgeText={top.name}
                    imageSrc={top.image}
                    accentColor={accentColor}
                    bgGradient={bgGradient}
                    durationInFrames={70}
                />
            </Sequence>

            {/* Beat 2: + THIS DENIM (70 - 135 frames / 2.16s) */}
            <Sequence from={70} durationInFrames={65}>
                <SingleItemScene
                    title="+ THIS DENIM"
                    badgeText="Wide-Leg Denim 👖"
                    imageSrc={bottom.image}
                    accentColor={accentColor}
                    bgGradient={bgGradient}
                    durationInFrames={65}
                />
            </Sequence>

            {/* Beat 3: + THESE HEELS (135 - 205 frames / 2.33s) */}
            <Sequence from={135} durationInFrames={70}>
                <SingleItemScene
                    title="+ THESE HEELS"
                    badgeText="Crystal Stilettos 👠"
                    imageSrc={shoesImg}
                    accentColor={accentColor}
                    bgGradient={bgGradient}
                    durationInFrames={70}
                />
            </Sequence>

            {/* Beat 4: DIRECT SEAMLESS CUT TO THE FULL FIT ON MODEL (205 - 350 frames / 4.83s) */}
            <Sequence from={205} durationInFrames={145}>
                <FullLookScene
                    frontImg={fullSet.frontImage}
                    backImg={fullSet.backImage}
                    sideImg={fullSet.sideImage}
                    accentColor={accentColor}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
