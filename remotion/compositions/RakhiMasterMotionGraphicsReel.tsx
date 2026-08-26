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

interface RakhiMasterMotionGraphicsProps {
    includeVoiceover?: boolean;
}

// =======================================================
// SCENE 1: LUXURY GIFT BOX UNBOXING (0 - 110 frames / 3.66s)
// =======================================================
const GiftBoxScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
    const scale = interpolate(frame, [0, 110], [1.08, 1.0], { extrapolateRight: "clamp" });
    const glowOpacity = interpolate(Math.sin(frame / 12), [-1, 1], [0.3, 0.7]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#060504", overflow: "hidden" }}>
            {/* Ambient Gold Halo */}
            <div
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 650,
                    height: 650,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,169,109,0.35) 0%, rgba(0,0,0,0) 70%)",
                    opacity: glowOpacity,
                    filter: "blur(40px)",
                }}
            />

            {/* Top Kinetic Badges */}
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -25}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "7px 24px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.22)",
                        border: "1.5px solid rgba(224, 169, 109, 0.65)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.2em",
                        color: "#E0A96D",
                        marginBottom: 10,
                        textTransform: "uppercase",
                        boxShadow: "0 0 20px rgba(224, 169, 109, 0.3)",
                    }}
                >
                    🪢 RAKHI SPECIAL GIFTING BOX
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 30px rgba(0,0,0,0.95)",
                    }}
                >
                    The Sister-Proof Gift ✨
                </h1>
            </div>

            {/* Main Luxury Gift Box Image Card */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 55,
                    right: 55,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "2px solid rgba(224, 169, 109, 0.55)",
                    transform: `scale(${scale * entrance})`,
                    boxShadow: "0 30px 70px rgba(0,0,0,0.9), 0 0 40px rgba(224,169,109,0.25)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={staticFile("/images/products/tenet-collection/tenet-rakhi-luxury-gift-box.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Glassmorphism Floating Tag */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 24,
                        left: 20,
                        right: 20,
                        padding: "14px 20px",
                        borderRadius: 20,
                        background: "rgba(10, 8, 6, 0.85)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(224, 169, 109, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#FFFFFF" }}>
                        Free Custom Packaging 🎁
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 800, color: "#E0A96D", letterSpacing: "0.1em" }}>
                        WORTH ₹799 (FREE)
                    </span>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 2: VIRAL SITTING POSE & TASSEL DETAIL (110 - 220 frames / 3.66s)
// =======================================================
const SittingPoseScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
    const scale = interpolate(frame, [0, 110], [1.05, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Top Badges */}
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -20}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "7px 24px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.25)",
                        border: "1.5px solid rgba(224, 169, 109, 0.6)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        color: "#E0A96D",
                        marginBottom: 10,
                        textTransform: "uppercase",
                    }}
                >
                    🤎 CHOCOLATE & IVORY SET
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Modern Corset-Tie Slit 🎀
                </h1>
            </div>

            {/* Model Image Card */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 55,
                    right: 55,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "2px solid rgba(224, 169, 109, 0.6)",
                    transform: `scale(${scale * entrance})`,
                    boxShadow: "0 30px 70px rgba(0,0,0,0.9)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={staticFile("/images/products/tenet-collection/model-chocolate-ivory-sitting.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Floating Feature Badges */}
                <div
                    style={{
                        position: "absolute",
                        top: 24,
                        left: 20,
                        padding: "8px 18px",
                        borderRadius: 99,
                        background: "rgba(10, 8, 6, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(224, 169, 109, 0.5)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#E0A96D",
                    }}
                >
                    ✨ Pure Silk Cotton
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 24,
                        right: 20,
                        padding: "8px 18px",
                        borderRadius: 99,
                        background: "rgba(10, 8, 6, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(224, 169, 109, 0.5)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#E0A96D",
                    }}
                >
                    🧵 Handcrafted Tassels
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 3: 3D MULTI-CARD FAN CLASH (220 - 340 frames / 4.0s)
// =======================================================
const ColorwaysFanScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });

    // Staggered offsets for 3 distinct colorway cards
    const card1Spring = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const card2Spring = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 140 } });
    const card3Spring = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 140 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#060504", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -20}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "7px 24px",
                        borderRadius: 99,
                        background: "rgba(107, 164, 232, 0.25)",
                        border: "1.5px solid rgba(107, 164, 232, 0.6)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        color: "#6BA4E8",
                        marginBottom: 10,
                        textTransform: "uppercase",
                    }}
                >
                    🌈 5 ICONIC COLORWAYS
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Which Color Will She Pick? 💖
                </h1>
            </div>

            {/* 3D Staggered Fanned Cards */}
            <div
                style={{
                    position: "absolute",
                    top: 240,
                    left: 0,
                    right: 0,
                    height: 1250,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    perspective: 1200,
                }}
            >
                {/* Left Card: Royal Navy */}
                <div
                    style={{
                        position: "absolute",
                        width: 520,
                        height: 980,
                        borderRadius: 32,
                        overflow: "hidden",
                        border: "2px solid #6BA4E8",
                        transform: `translateX(-160px) rotate(-8deg) scale(${card1Spring * 0.9})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        zIndex: 10,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/bue.webp")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: 16, left: 16, padding: "6px 14px", borderRadius: 99, background: "#6BA4E8", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>
                        💙 Royal Navy
                    </div>
                </div>

                {/* Right Card: Sunset Gold / Orange */}
                <div
                    style={{
                        position: "absolute",
                        width: 520,
                        height: 980,
                        borderRadius: 32,
                        overflow: "hidden",
                        border: "2px solid #F4B860",
                        transform: `translateX(160px) rotate(8deg) scale(${card2Spring * 0.9})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        zIndex: 10,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/orange.webp")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: 16, right: 16, padding: "6px 14px", borderRadius: 99, background: "#F4B860", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>
                        💛 Sunset Gold
                    </div>
                </div>

                {/* Center Hero Card: Blush Rose Pink */}
                <div
                    style={{
                        position: "absolute",
                        width: 580,
                        height: 1080,
                        borderRadius: 36,
                        overflow: "hidden",
                        border: "2.5px solid #F3A6B2",
                        transform: `scale(${card3Spring})`,
                        boxShadow: "0 35px 80px rgba(0,0,0,0.95), 0 0 40px rgba(243,166,178,0.3)",
                        zIndex: 20,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/pink.webp")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "8px 20px", borderRadius: 99, background: "#F3A6B2", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 900 }}>
                        🌸 Blush Rose Pink
                    </div>
                </div>
            </div>

            <ConversionOverlay accentColor="#F3A6B2" ctaPillText='Comment "1, 2 or 3" 👇' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 4: 3-PIECE COMPLETE STYLING SOLUTION (340 - 440 frames / 3.33s)
// =======================================================
const CompleteOutfitScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 13, stiffness: 120 } });
    const topSpring = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const bottomSpring = spring({ frame: frame - 3, fps, config: { damping: 12, stiffness: 140 } });
    const heelsSpring = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 140 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -20}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "7px 24px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.25)",
                        border: "1.5px solid rgba(224, 169, 109, 0.6)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        color: "#E0A96D",
                        marginBottom: 10,
                        textTransform: "uppercase",
                    }}
                >
                    👗 COMPLETE 3-PIECE OUTFIT
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Top + Pants + Heels ✨
                </h1>
            </div>

            {/* 3 Grid Cards */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 45,
                    right: 45,
                    height: 1250,
                    display: "flex",
                    gap: 16,
                    zIndex: 10,
                }}
            >
                {/* 1. Kurti Top */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                        transform: `scale(${topSpring})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/cho.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 12, padding: "6px 12px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                        1. Tassel Top
                    </div>
                </div>

                {/* 2. Flared Bottom */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                        transform: `scale(${bottomSpring})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/baige.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 12, padding: "6px 12px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                        2. Ivory Pants
                    </div>
                </div>

                {/* 3. Heels */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                        transform: `scale(${heelsSpring})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/heel.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 12, padding: "6px 12px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                        3. Crystal Heels
                    </div>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 5: HIGH-CONVERTING FESTIVE CLIMAX & CTA (440 - 552 frames / 3.73s)
// =======================================================
const FestiveClimaxScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
    const buttonPulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.98, 1.04]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#060504", overflow: "hidden" }}>
            {/* Background Festive Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,169,109,0.4) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(50px)",
                }}
            />

            {/* Top Heading */}
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 20,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `scale(${entrance})`,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "8px 28px",
                        borderRadius: 99,
                        background: "#E0A96D",
                        color: "#080706",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                        boxShadow: "0 0 25px rgba(224, 169, 109, 0.6)",
                        marginBottom: 10,
                        textTransform: "uppercase",
                    }}
                >
                    🔥 RAKHI SPECIAL: FLAT 30% OFF
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 52,
                        fontWeight: 800,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Use Code: RAKHI30 ✨
                </h1>
            </div>

            {/* Central Collage of Gift Box & Model */}
            <div
                style={{
                    position: "absolute",
                    top: 240,
                    left: 55,
                    right: 55,
                    height: 1250,
                    display: "flex",
                    gap: 16,
                    zIndex: 10,
                }}
            >
                <div
                    style={{
                        flex: 1,
                        borderRadius: 32,
                        overflow: "hidden",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/tenet-rakhi-luxury-gift-box.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                <div
                    style={{
                        flex: 1,
                        borderRadius: 32,
                        overflow: "hidden",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/model-chocolate-ivory-sitting.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* Pulsing Climax CTA Overlay */}
            <div
                style={{
                    position: "absolute",
                    bottom: 75,
                    left: 30,
                    right: 30,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 50,
                }}
            >
                <div
                    style={{
                        transform: `scale(${buttonPulse})`,
                        background: "linear-gradient(135deg, #F5D77F 0%, #E0A96D 50%, #C88D4D 100%)",
                        color: "#080706",
                        padding: "20px 48px",
                        borderRadius: 99,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 22,
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        boxShadow: "0 15px 40px rgba(224, 169, 109, 0.6), 0 0 20px rgba(245, 215, 127, 0.4)",
                        textTransform: "uppercase",
                        textAlign: "center",
                    }}
                >
                    💬 Comment "RAKHI" for DM ✨
                </div>

                <div
                    style={{
                        marginTop: 12,
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 16,
                        letterSpacing: "0.35em",
                        color: "rgba(255,255,255,0.7)",
                        textTransform: "uppercase",
                    }}
                >
                    TENET
                </div>
            </div>
        </AbsoluteFill>
    );
};

// =======================================================
// MASTER RAKHI MOTION GRAPHICS REEL (552 frames / 18.40s)
// =======================================================
export const RakhiMasterMotionGraphicsReel: React.FC<RakhiMasterMotionGraphicsProps> = ({
    includeVoiceover = false,
}) => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#060504" }}>
            {/* 1. Subtle Hype R&B Music (Volume 0.18 for vocal clarity) */}
            <Audio
                src={staticFile("/audio/music/music-showdown-hype.mp3")}
                volume={0.18}
            />

            {/* 2. Synced SFX Transitions */}
            <Sequence from={0} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>
            <Sequence from={110} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={220} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={340} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>
            <Sequence from={440} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.5} />
            </Sequence>

            {/* 3. Optional Voiceover Layer (Included when includeVoiceover=true) */}
            {includeVoiceover && (
                <Sequence from={0}>
                    <Audio
                        src={staticFile("/audio/voiceovers/vo-female-rakhi-promo.wav")}
                        volume={1.0}
                    />
                </Sequence>
            )}

            {/* 4. Motion Graphic Timeline Sequences */}
            <Sequence from={0} durationInFrames={110}>
                <GiftBoxScene />
            </Sequence>
            <Sequence from={110} durationInFrames={110}>
                <SittingPoseScene />
            </Sequence>
            <Sequence from={220} durationInFrames={120}>
                <ColorwaysFanScene />
            </Sequence>
            <Sequence from={340} durationInFrames={100}>
                <CompleteOutfitScene />
            </Sequence>
            <Sequence from={440} durationInFrames={112}>
                <FestiveClimaxScene />
            </Sequence>
        </AbsoluteFill>
    );
};
