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
// SCENE 1: BESPOKE UNBOXING REVEAL (0 - 85 frames / 2.83s)
// =======================================================
const UnboxingRevealScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const scale = interpolate(frame, [0, 85], [1.04, 1.0], { extrapolateRight: "clamp" });

    // Morph or switch between closed minimal box (frames 0-35) and open reveal (frames 35-85)
    const isRevealed = frame >= 35;
    const revealSpring = spring({ frame: frame - 35, fps, config: { damping: 12, stiffness: 150 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Soft Ambient Gold Spotlight */}
            <div
                style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,169,109,0.25) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(50px)",
                }}
            />

            {/* Top Kinetic Badges */}
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -18}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 24px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.18)",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.2em",
                        color: "#E0A96D",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    🪢 RAKHI SPECIAL DROP
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
                    {isRevealed ? "Luxury Unboxing Inside ✨" : "The Sister-Proof Gift 🎁"}
                </h1>
            </div>

            {/* Main Visual Card */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 55,
                    right: 55,
                    height: 1260,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "1.5px solid rgba(224, 169, 109, 0.4)",
                    transform: `scale(${scale * entrance})`,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#12100E",
                }}
            >
                <Img
                    src={
                        isRevealed
                            ? staticFile("/images/products/tenet-collection/luxury-rakhi-unboxing-open.png")
                            : staticFile("/images/products/tenet-collection/tenet-rakhi-luxury-gift-box.png")
                    }
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: isRevealed ? `scale(${1 + (1 - revealSpring) * 0.05})` : "none",
                    }}
                />

                {/* Bottom Glassmorphism Tag */}
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
                        border: "1px solid rgba(224, 169, 109, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#FFFFFF" }}>
                        Free Luxury Box & Rakhi 🎁
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 800, color: "#E0A96D", letterSpacing: "0.1em" }}>
                        FREE WITH ORDER
                    </span>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 2: VIRAL SITTING HERO & TASSEL DETAIL (85 - 175 frames / 3.0s)
// =======================================================
const HeroModelScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const scale = interpolate(frame, [0, 90], [1.03, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 22px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.18)",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        color: "#E0A96D",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    🤎 VIRAL TASSEL KURTI
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

            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 55,
                    right: 55,
                    height: 1260,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "1.5px solid rgba(224, 169, 109, 0.45)",
                    transform: `scale(${scale * entrance})`,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#12100E",
                }}
            >
                <Img
                    src={staticFile("/images/products/tenet-collection/model-chocolate-ivory-sitting.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        padding: "8px 18px",
                        borderRadius: 99,
                        background: "rgba(10, 8, 6, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
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
                        bottom: 20,
                        right: 20,
                        padding: "8px 18px",
                        borderRadius: 99,
                        background: "rgba(10, 8, 6, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#E0A96D",
                    }}
                >
                    🤍 Ivory Flared Fit
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 3: FAST 4-COLORWAY CLASH (175 - 315 frames / 4.66s)
// =======================================================
const FastColorwaysScene: React.FC = () => {
    const frame = useCurrentFrame();

    const colorItems = [
        {
            name: "Royal Navy Blue",
            badge: "💙 Royal Navy",
            color: "#6BA4E8",
            image: staticFile("/images/products/tenet-collection/bue.webp"),
        },
        {
            name: "Sunset Gold",
            badge: "💛 Sunset Gold",
            color: "#F4B860",
            image: staticFile("/images/products/tenet-collection/orange.webp"),
        },
        {
            name: "Blush Rose Pink",
            badge: "🌸 Blush Pink",
            color: "#F3A6B2",
            image: staticFile("/images/products/tenet-collection/pink.webp"),
        },
        {
            name: "Pastel Blossom Pink",
            badge: "🌷 Blossom Pink",
            color: "#FFAAA6",
            image: staticFile("/images/products/tenet-collection/l pink.webp"),
        },
    ];

    // Cycle through each of the 4 colors every 35 frames
    const activeIndex = Math.min(Math.floor(frame / 35), colorItems.length - 1);
    const active = colorItems[activeIndex];

    const subFrame = frame % 35;
    const scale = interpolate(subFrame, [0, 35], [1.03, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 22px",
                        borderRadius: 99,
                        background: `${active.color}22`,
                        border: `1.5px solid ${active.color}66`,
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        color: active.color,
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    {active.badge}
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
                    5 Viral Colorways 💖
                </h1>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 55,
                    right: 55,
                    height: 1260,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: `2px solid ${active.color}55`,
                    transform: `scale(${scale})`,
                    boxShadow: `0 25px 60px rgba(0,0,0,0.9), 0 0 30px ${active.color}22`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#12100E",
                }}
            >
                <Img src={active.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <ConversionOverlay accentColor={active.color} ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 4: 3-PIECE COMPLETE OUTFIT STACK (315 - 420 frames / 3.5s)
// =======================================================
const CompleteOutfitStackScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const card1 = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
    const card2 = spring({ frame: frame - 3, fps, config: { damping: 13, stiffness: 140 } });
    const card3 = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 140 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 22px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.18)",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        backdropFilter: "blur(12px)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: "0.18em",
                        color: "#E0A96D",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    👗 3-PIECE COMPLETE FIT
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
                    top: 230,
                    left: 45,
                    right: 45,
                    height: 1260,
                    display: "flex",
                    gap: 14,
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
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${card1})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#12100E",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/cho.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 10, padding: "6px 12px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 900 }}>
                        1. Tassel Top
                    </div>
                </div>

                {/* 2. Flared Ivory Pants */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${card2})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#12100E",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/baige.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 10, padding: "6px 12px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 900 }}>
                        2. Ivory Pants
                    </div>
                </div>

                {/* 3. Crystal Slide Heels */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${card3})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#12100E",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/heel.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 14, left: 10, padding: "6px 12px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 900 }}>
                        3. Slide Heels
                    </div>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 5: HIGH-CONVERTING CLIMAX & CTA (420 - 552 frames / 4.4s)
// =======================================================
const FestiveClimaxScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
    const buttonPulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.98, 1.03]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 105,
                    left: 24,
                    right: 24,
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
                        padding: "7px 26px",
                        borderRadius: 99,
                        background: "#E0A96D",
                        color: "#080706",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15,
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                        boxShadow: "0 0 25px rgba(224, 169, 109, 0.5)",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    🔥 RAKHI SPECIAL: FLAT 30% OFF
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 800,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Use Code: RAKHI30 ✨
                </h1>
            </div>

            {/* Side-by-Side: Open Luxury Box + Model */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 50,
                    right: 50,
                    height: 1260,
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
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#12100E",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/luxury-rakhi-unboxing-open.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>

                <div
                    style={{
                        flex: 1,
                        borderRadius: 32,
                        overflow: "hidden",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#12100E",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/tenet-collection/model-chocolate-ivory-sitting.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            </div>

            {/* Bottom High-Converting Action Banner */}
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
                        padding: "18px 44px",
                        borderRadius: 99,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 21,
                        fontWeight: 900,
                        letterSpacing: "0.06em",
                        boxShadow: "0 15px 40px rgba(224, 169, 109, 0.5)",
                        textTransform: "uppercase",
                        textAlign: "center",
                    }}
                >
                    💬 Comment "RAKHI" for DM ✨
                </div>

                <div
                    style={{
                        marginTop: 10,
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 15,
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
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* 1. Subtle Luxury Music (Volume 0.18) */}
            <Audio
                src={staticFile("/audio/music/music-showdown-hype.mp3")}
                volume={0.18}
            />

            {/* 2. Synced Sound Effects */}
            <Sequence from={0} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={35} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={85} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={175} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={210} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={245} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={280} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={315} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={420} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>

            {/* 3. Optional Voiceover Layer */}
            {includeVoiceover && (
                <Sequence from={0}>
                    <Audio
                        src={staticFile("/audio/voiceovers/vo-female-rakhi-promo.wav")}
                        volume={1.0}
                    />
                </Sequence>
            )}

            {/* 4. Motion Graphic Timeline Sequences */}
            <Sequence from={0} durationInFrames={85}>
                <UnboxingRevealScene />
            </Sequence>
            <Sequence from={85} durationInFrames={90}>
                <HeroModelScene />
            </Sequence>
            <Sequence from={175} durationInFrames={140}>
                <FastColorwaysScene />
            </Sequence>
            <Sequence from={315} durationInFrames={105}>
                <CompleteOutfitStackScene />
            </Sequence>
            <Sequence from={420} durationInFrames={132}>
                <FestiveClimaxScene />
            </Sequence>
        </AbsoluteFill>
    );
};
