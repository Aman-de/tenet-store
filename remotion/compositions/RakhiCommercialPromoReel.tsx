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

// =======================================================
// SCENE 1: THE BANTER HOOK (0 - 240 frames / 8.0s)
// =======================================================
const BanterHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleEntrance = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
    const cardEntrance = spring({ frame: frame - 4, fps, config: { damping: 12, stiffness: 140 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Header */}
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
                        background: "rgba(224, 169, 109, 0.2)",
                        border: "1px solid rgba(224, 169, 109, 0.5)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.2em",
                        color: "#E0A96D",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    🪢 RAKHI GIFTING DILEMMA
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
                    Rakhi Aa Rahi Hai? 🤯
                </h1>
            </div>

            {/* Split Visual Card */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 50,
                    right: 50,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "2px solid rgba(224, 169, 109, 0.4)",
                    transform: `scale(${cardEntrance})`,
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={staticFile("/images/products/chocolate-set/model_front.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                
                {/* Dialogue Speech Bubble */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 30,
                        left: 20,
                        right: 20,
                        padding: "16px 24px",
                        borderRadius: 24,
                        background: "rgba(10, 8, 7, 0.88)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid rgba(224, 169, 109, 0.6)",
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 20,
                            fontWeight: 700,
                            color: "#FFFFFF",
                            margin: 0,
                        }}
                    >
                        "Bhai itna tension kyu? Behen ke liye gift nahi mil raha?" 🤔
                    </p>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 2: THE PAIN POINT (240 - 455 frames / 7.16s)
// =======================================================
const PainPointScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
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
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "6px 20px",
                        borderRadius: 99,
                        background: "rgba(226, 109, 125, 0.2)",
                        border: "1px solid rgba(226, 109, 125, 0.5)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        letterSpacing: "0.2em",
                        color: "#E26D7D",
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    NO MORE BORING GIFTS ❌
                </div>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 44,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Saal Bhar Ke Taane Mat Suno! 😅
                </h2>
            </div>

            {/* Split Comparison of Boring vs Tenet */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 40,
                    right: 40,
                    height: 1250,
                    display: "flex",
                    gap: 16,
                    zIndex: 10,
                }}
            >
                {/* Left Card: ❌ Boring ₹500 Lifafa */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        background: "#1A1512",
                        border: "2px solid rgba(226, 109, 125, 0.5)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                        textAlign: "center",
                    }}
                >
                    <div style={{ fontSize: 72, marginBottom: 12 }}>❌</div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#E26D7D", margin: "0 0 8px 0" }}>
                        Boring Gifts
                    </h3>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                        Chocolates / ₹500 Lifafa
                    </p>
                </div>

                {/* Right Card: ✅ Tenet Luxury Kurti */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                    }}
                >
                    <Img
                        src={staticFile("/images/products/chocolate-set/blue/combo_4.webp")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            padding: "6px 16px",
                            borderRadius: 99,
                            background: "#E0A96D",
                            color: "#080706",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 14,
                            fontWeight: 900,
                        }}
                    >
                        ✅ TENET FIT
                    </div>
                </div>
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Comment "RAKHI" for DM ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 3: THE DISCOVERY (455 - 700 frames / 8.16s)
// =======================================================
const DiscoveryScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const scale = interpolate(frame, [0, 245], [1.04, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
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
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
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
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    🔥 TENET RAKHI DROP
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
                    Flat 30% OFF + Fast Delivery 🚀
                </h1>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 60,
                    right: 60,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: "2.5px solid rgba(224, 169, 109, 0.6)",
                    transform: `scale(${scale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(224, 169, 109, 0.25)",
                }}
            >
                <Img
                    src={staticFile("/images/products/chocolate-set/chocolate-white/combo_4.webp")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>

            <ConversionOverlay accentColor="#E0A96D" ctaPillText='Use Code: RAKHI30 ✨' />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 4: PROFESSIONAL COMMERCIAL PROMO (700 - 1195 frames / 16.5s)
// =======================================================
const CommercialPromoScene: React.FC = () => {
    const frame = useCurrentFrame();

    // Rotate through the 5 colors rapidly every 90 frames
    const colorIndex = Math.min(Math.floor(frame / 90), colorsData.length - 1);
    const activeItem = colorsData[colorIndex];

    const subFrame = frame % 90;
    const scale = interpolate(subFrame, [0, 90], [1.04, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Top Commercial Glowing Banner */}
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
                    zIndex: 30,
                }}
            >
                <div
                    style={{
                        padding: "8px 26px",
                        borderRadius: 99,
                        background: activeItem.color,
                        color: "#080706",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        boxShadow: `0 8px 25px ${activeItem.color}55`,
                        marginBottom: 8,
                        textTransform: "uppercase",
                    }}
                >
                    {activeItem.num}. {activeItem.name} {activeItem.emoji}
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
                    Flat 30% OFF • Rakhi Drop 🪢
                </h1>
            </div>

            {/* Main Product Showcase */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 60,
                    right: 60,
                    height: 1250,
                    borderRadius: 36,
                    overflow: "hidden",
                    border: `2px solid ${activeItem.color}66`,
                    transform: `scale(${scale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 35px ${activeItem.color}25`,
                }}
            >
                <Img src={activeItem.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Bottom High-Converting Action Banner */}
            <ConversionOverlay
                accentColor={activeItem.color}
                ctaPillText='Comment "RAKHI" for DM ✨'
            />
        </AbsoluteFill>
    );
};

// =======================================================
// MASTER RAKHI COMMERCIAL PROMO REEL (1195 frames / 39.83s)
// =======================================================
export const RakhiCommercialPromoReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* Subtle Luxury Fashion Music (0.18 Volume) */}
            <Audio
                src={staticFile("/audio/music/music-showdown-hype.mp3")}
                volume={0.18}
            />

            {/* Hindi Fast Dialogue & Professional Promo Voiceovers */}
            {/* 1. Aman Intro */}
            <Sequence from={4}>
                <Audio src={staticFile("/audio/voiceovers/vo-rakhi-aman1-fast.mp3")} volume={1.0} />
            </Sequence>

            {/* 2. Rahul Response */}
            <Sequence from={242}>
                <Audio src={staticFile("/audio/voiceovers/vo-rakhi-rahul-fast.mp3")} volume={1.0} />
            </Sequence>

            {/* 3. Aman Referral */}
            <Sequence from={458}>
                <Audio src={staticFile("/audio/voiceovers/vo-rakhi-aman2-fast.mp3")} volume={1.0} />
            </Sequence>

            {/* 4. Professional Commercial Promo Artist */}
            <Sequence from={702}>
                <Audio src={staticFile("/audio/voiceovers/vo-rakhi-promo-fast.mp3")} volume={1.0} />
            </Sequence>

            {/* SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={240} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={455} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={700} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>
            <Sequence from={790} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={880} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={970} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>

            {/* Visual Timeline */}
            <Sequence from={0} durationInFrames={240}>
                <BanterHookScene />
            </Sequence>
            <Sequence from={240} durationInFrames={215}>
                <PainPointScene />
            </Sequence>
            <Sequence from={455} durationInFrames={245}>
                <DiscoveryScene />
            </Sequence>
            <Sequence from={700} durationInFrames={495}>
                <CommercialPromoScene />
            </Sequence>
        </AbsoluteFill>
    );
};
