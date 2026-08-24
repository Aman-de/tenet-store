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
import { ConversionOverlay } from "../components/ConversionOverlay";
import "../styles/remotion.css";

const colorsData = [
    {
        num: "1",
        name: "Chocolate Brown",
        emoji: "🤎",
        color: "#E0A96D",
        image: staticFile("/images/products/chocolate-set/model_front.png"),
    },
    {
        num: "2",
        name: "Royal Navy Blue",
        emoji: "💙",
        color: "#6BA4E8",
        image: staticFile("/images/products/chocolate-set/blue/combo_4.webp"),
    },
    {
        num: "3",
        name: "Crimson Wine Red",
        emoji: "🍷",
        color: "#E26D7D",
        image: staticFile("/images/products/chocolate-set/red/combo_4.webp"),
    },
    {
        num: "4",
        name: "Mustard Gold Yellow",
        emoji: "💛",
        color: "#F4B860",
        image: staticFile("/images/products/chocolate-set/yellow/combo_4.webp"),
    },
    {
        num: "5",
        name: "Blush Light Pink",
        emoji: "🌸",
        color: "#F3A6B2",
        image: staticFile("/images/products/chocolate-set/light-pink/combo_4.webp"),
    },
];

// =========================================================================
// 🔥 3D STAGGERED ANIMATED FAN SHOWCASE HOOK
// =========================================================================
const AllColorsVisualHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 130 },
    });

    const card1Entrance = spring({
        frame: frame - 2,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const card2Entrance = spring({
        frame: frame - 6,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const card3Entrance = spring({
        frame: frame - 10,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Multi-Color Radial Background Glow */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(circle at 50% 35%, #221812 0%, #080706 75%)",
                }}
            />

            {/* Top Hook Banner (Safe Zone: Y = 110px) */}
            <div
                style={{
                    position: "absolute",
                    top: 110,
                    left: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - titleEntrance) * -20}px)`,
                    opacity: titleEntrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 20px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.25)",
                        border: "1px solid rgba(224, 169, 109, 0.6)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.2em",
                        color: "#E0A96D",
                        marginBottom: 10,
                        textTransform: "uppercase",
                    }}
                >
                    🔥 NEW DROP • 5 COLORWAYS
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        lineHeight: 1.15,
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    Which one do you choose? ✨
                </h1>
            </div>

            {/* 3D Staggered Animated Cards */}
            <div
                style={{
                    position: "absolute",
                    top: 250,
                    left: 30,
                    right: 30,
                    height: 1140,
                    zIndex: 10,
                }}
            >
                {/* Left Card: Navy Blue (Sliding from Left with -7deg Tilt) */}
                <div
                    style={{
                        position: "absolute",
                        top: 100,
                        left: 0,
                        width: 330,
                        height: 790,
                        borderRadius: 26,
                        overflow: "hidden",
                        border: "2px solid rgba(107, 164, 232, 0.6)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.75)",
                        transform: `translateX(${(1 - card2Entrance) * -80}px) rotate(-7deg)`,
                        opacity: card2Entrance,
                        zIndex: 15,
                    }}
                >
                    <Img
                        src={colorsData[1].image}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            padding: "6px 14px",
                            borderRadius: 99,
                            background: "#6BA4E8",
                            color: "#080706",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 14,
                            fontWeight: 900,
                        }}
                    >
                        2 💙
                    </div>
                </div>

                {/* Right Card: Crimson Red (Sliding from Right with +7deg Tilt) */}
                <div
                    style={{
                        position: "absolute",
                        top: 100,
                        right: 0,
                        width: 330,
                        height: 790,
                        borderRadius: 26,
                        overflow: "hidden",
                        border: "2px solid rgba(226, 109, 125, 0.6)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.75)",
                        transform: `translateX(${(1 - card3Entrance) * 80}px) rotate(7deg)`,
                        opacity: card3Entrance,
                        zIndex: 15,
                    }}
                >
                    <Img
                        src={colorsData[2].image}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            padding: "6px 14px",
                            borderRadius: 99,
                            background: "#E26D7D",
                            color: "#080706",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 14,
                            fontWeight: 900,
                        }}
                    >
                        3 🍷
                    </div>
                </div>

                {/* Center Featured Card: Chocolate Brown (Spring Scale from Center) */}
                <div
                    style={{
                        position: "absolute",
                        top: 30,
                        left: "50%",
                        transform: `translateX(-50%) scale(${card1Entrance})`,
                        width: 490,
                        height: 1000,
                        borderRadius: 34,
                        overflow: "hidden",
                        border: "2.5px solid rgba(224, 169, 109, 0.85)",
                        boxShadow:
                            "0 30px 70px rgba(0,0,0,0.95), 0 0 35px rgba(224, 169, 109, 0.35)",
                        opacity: card1Entrance,
                        zIndex: 20,
                    }}
                >
                    <Img
                        src={colorsData[0].image}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: 24,
                            left: "50%",
                            transform: "translateX(-50%)",
                            padding: "8px 24px",
                            borderRadius: 99,
                            background: "rgba(10, 8, 7, 0.9)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(224, 169, 109, 0.7)",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 16,
                            fontWeight: 800,
                            color: "#FFFFFF",
                            whiteSpace: "nowrap",
                        }}
                    >
                        1. Chocolate Brown 🤎
                    </div>
                </div>
            </div>

            {/* Bottom Conversion Pill */}
            <ConversionOverlay
                accentColor="#E0A96D"
                ctaPillText='Comment "LINK" for DM ✨'
            />
        </AbsoluteFill>
    );
};

// =========================================================================
// SINGLE COLORWAY CARD
// =========================================================================
const SingleColorCard: React.FC<{
    item: (typeof colorsData)[0];
    durationInFrames: number;
}> = ({ item, durationInFrames }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
    const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 115,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "8px 26px",
                        borderRadius: 99,
                        background: item.color,
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 18,
                        fontWeight: 900,
                        letterSpacing: "0.04em",
                        boxShadow: `0 8px 25px ${item.color}55`,
                    }}
                >
                    {item.num}. {item.name} {item.emoji}
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 70,
                    right: 70,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: `2px solid ${item.color}55`,
                    transform: `scale(${scale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 30px ${item.color}22`,
                }}
            >
                <Img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <ConversionOverlay
                accentColor={item.color}
                ctaPillText={`Comment "${item.num}" or "LINK" 👇`}
            />
        </AbsoluteFill>
    );
};

// =========================================================================
// MASTER 5-COLORWAY SHOWDOWN COMPOSITION
// =========================================================================
export const AllColorsShowdownReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* Subtle Runway Beat (Lowered to 0.18) */}
            <Audio
                src={staticFile("/audio/music/music-showdown-hype.mp3")}
                volume={0.18}
            />

            {/* AI Female Voiceover Clips (Crisp at 1.0) */}
            <Sequence from={4}>
                <Audio src={staticFile("/audio/voiceovers/vo-showdown-intro-v2.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={74}>
                <Audio src={staticFile("/audio/voiceovers/vo-showdown-1.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={148}>
                <Audio src={staticFile("/audio/voiceovers/vo-showdown-2.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={223}>
                <Audio src={staticFile("/audio/voiceovers/vo-showdown-3.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={298}>
                <Audio src={staticFile("/audio/voiceovers/vo-showdown-4.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={368}>
                <Audio src={staticFile("/audio/voiceovers/vo-showdown-5.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={454}>
                <Audio src={staticFile("/audio/voiceovers/vo-showdown-cta-v2.mp3")} volume={1.0} />
            </Sequence>

            {/* SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={70} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={145} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={220} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={295} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={365} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={450} durationInFrames={25}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>

            {/* Visual Sequences */}
            {/* Beat 1: ATTENTION-GRABBING 5-WAY VISUAL HOOK (0 to 70 frames) */}
            <Sequence from={0} durationInFrames={70}>
                <AllColorsVisualHookScene />
            </Sequence>

            {/* Beat 2 to 6: 5 Individual Colors */}
            <Sequence from={70} durationInFrames={75}>
                <SingleColorCard item={colorsData[0]} durationInFrames={75} />
            </Sequence>
            <Sequence from={145} durationInFrames={75}>
                <SingleColorCard item={colorsData[1]} durationInFrames={75} />
            </Sequence>
            <Sequence from={220} durationInFrames={75}>
                <SingleColorCard item={colorsData[2]} durationInFrames={75} />
            </Sequence>
            <Sequence from={295} durationInFrames={70}>
                <SingleColorCard item={colorsData[3]} durationInFrames={70} />
            </Sequence>
            <Sequence from={365} durationInFrames={85}>
                <SingleColorCard item={colorsData[4]} durationInFrames={85} />
            </Sequence>

            {/* Beat 7: Comment & DM Link Outro (450 to 520 frames) */}
            <Sequence from={450} durationInFrames={70}>
                <AbsoluteFill style={{ backgroundColor: "#080706", justifyContent: "center", alignItems: "center" }}>
                    <div
                        style={{
                            position: "absolute",
                            top: 115,
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            zIndex: 30,
                        }}
                    >
                        <h1
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontSize: 48,
                                fontWeight: 700,
                                color: "#FFFFFF",
                                margin: 0,
                            }}
                        >
                            Drop your number 👇
                        </h1>
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 235,
                            left: 70,
                            right: 70,
                            height: 1250,
                            borderRadius: 36,
                            overflow: "hidden",
                            border: "2px solid rgba(224, 169, 109, 0.4)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        }}
                    >
                        <Img
                            src={staticFile("/images/products/chocolate-set/model_side.png")}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>

                    <ConversionOverlay
                        accentColor="#E0A96D"
                        ctaPillText='Comment "LINK" for DM ✨'
                    />
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
