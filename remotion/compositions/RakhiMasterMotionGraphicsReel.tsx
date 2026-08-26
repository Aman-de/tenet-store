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
// SCENE 1: MINIMAL PHOTOREALISTIC GIFT BOX (0 - 105 frames / 3.5s)
// =======================================================
const MinimalGiftBoxScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
    const scale = interpolate(frame, [0, 105], [1.04, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
            {/* Soft Ambient Studio Lighting */}
            <div
                style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    height: 700,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(224,169,109,0.2) 0%, rgba(0,0,0,0) 70%)",
                    filter: "blur(50px)",
                }}
            />

            {/* Top Clean Editorial Badge */}
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
                        background: "rgba(224, 169, 109, 0.15)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
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
                    🪢 RAKHI GIFT PACKAGING
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 46,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    The Sister-Proof Gift ✨
                </h1>
            </div>

            {/* Main Photorealistic Gift Box Card */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 55,
                    right: 55,
                    height: 1260,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    transform: `scale(${scale * entrance})`,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#12100E",
                }}
            >
                <Img
                    src={staticFile("/images/products/tenet-collection/tenet-rakhi-luxury-gift-box.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Bottom Minimal Feature Badge */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 24,
                        left: 20,
                        right: 20,
                        padding: "14px 20px",
                        borderRadius: 20,
                        background: "rgba(12, 10, 8, 0.85)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "#FFFFFF" }}>
                        Free Luxury Gift Box 🎁
                    </span>
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 800, color: "#E0A96D", letterSpacing: "0.1em" }}>
                        INCLUDED FREE
                    </span>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 2: CLEAN FULL HERO SITTING MODEL (105 - 215 frames / 3.66s)
// =======================================================
const HeroModelScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
    const scale = interpolate(frame, [0, 110], [1.03, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
            {/* Top Badges */}
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
                        background: "rgba(224, 169, 109, 0.15)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
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
                        fontSize: 46,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Modern Corset-Tie Slit 🎀
                </h1>
            </div>

            {/* Main Model Picture */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 55,
                    right: 55,
                    height: 1260,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "1px solid rgba(224, 169, 109, 0.45)",
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

                {/* Floating Feature Badges */}
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
// SCENE 3: CLEAN SEQUENTIAL COLORWAYS SHOWCASE (215 - 330 frames / 3.83s)
// =======================================================
const ColorwaysSequentialScene: React.FC = () => {
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
    ];

    // Cycle smoothly through 3 colors (~38 frames per color)
    const activeIndex = Math.min(Math.floor(frame / 38), colorItems.length - 1);
    const active = colorItems[activeIndex];

    const subFrame = frame % 38;
    const scale = interpolate(subFrame, [0, 38], [1.03, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
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
                        border: `1px solid ${active.color}66`,
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
                        fontSize: 46,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    5 Viral Colorways 💖
                </h1>
            </div>

            {/* Clear Spotlight Card */}
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
// SCENE 4: 3-PIECE COMPLETE LOOK (330 - 440 frames / 3.66s)
// =======================================================
const CompleteLookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
    const card1 = spring({ frame, fps, config: { damping: 13, stiffness: 130 } });
    const card2 = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 130 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
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
                        background: "rgba(224, 169, 109, 0.15)",
                        border: "1px solid rgba(224, 169, 109, 0.4)",
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
                    👗 COMPLETE 3-PIECE STYLING
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 46,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Top + Pants + Heels ✨
                </h1>
            </div>

            {/* Clear 2-Column Showcase */}
            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 45,
                    right: 45,
                    height: 1260,
                    display: "flex",
                    gap: 16,
                    zIndex: 10,
                }}
            >
                {/* 1. Kurti Top Card */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 32,
                        overflow: "hidden",
                        position: "relative",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${card1})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#12100E",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/cho.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 16, padding: "6px 14px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>
                        1. Tassel Top
                    </div>
                </div>

                {/* 2. Flared Ivory Pants Card */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 32,
                        overflow: "hidden",
                        position: "relative",
                        border: "1.5px solid rgba(224, 169, 109, 0.5)",
                        transform: `scale(${card2})`,
                        boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                        backgroundColor: "#12100E",
                    }}
                >
                    <Img src={staticFile("/images/products/tenet-collection/baige.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 16, padding: "6px 14px", borderRadius: 99, background: "#E0A96D", color: "#000", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>
                        2. Ivory Pants
                    </div>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 5: EDITORIAL CLIMAX & CTA (440 - 552 frames / 3.73s)
// =======================================================
const FestiveClimaxScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
    const buttonPulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.98, 1.03]);

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
            {/* Top Heading */}
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

            {/* Clean Side-by-Side Gift Box & Model */}
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
                        src={staticFile("/images/products/tenet-collection/tenet-rakhi-luxury-gift-box.png")}
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

            {/* Pulsing CTA Overlay */}
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
        <AbsoluteFill style={{ backgroundColor: "#0A0908" }}>
            {/* 1. Subtle Luxury Music (Volume 0.18) */}
            <Audio
                src={staticFile("/audio/music/music-showdown-hype.mp3")}
                volume={0.18}
            />

            {/* 2. Synced Sound Effects */}
            <Sequence from={0} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={105} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={215} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={253} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={291} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={330} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={440} durationInFrames={20}>
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
            <Sequence from={0} durationInFrames={105}>
                <MinimalGiftBoxScene />
            </Sequence>
            <Sequence from={105} durationInFrames={110}>
                <HeroModelScene />
            </Sequence>
            <Sequence from={215} durationInFrames={115}>
                <ColorwaysSequentialScene />
            </Sequence>
            <Sequence from={330} durationInFrames={110}>
                <CompleteLookScene />
            </Sequence>
            <Sequence from={440} durationInFrames={112}>
                <FestiveClimaxScene />
            </Sequence>
        </AbsoluteFill>
    );
};
