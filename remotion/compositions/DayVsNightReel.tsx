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

// =======================================================
// SCENE 1: TWO ICONIC LOOKS SPLIT HOOK (0 - 145 frames / 4.83s)
// =======================================================
const TwoLooksHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 130 },
    });

    const leftCard = spring({
        frame: frame - 2,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const rightCard = spring({
        frame: frame - 4,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const vsEntrance = spring({
        frame: frame - 8,
        fps,
        config: { damping: 10, stiffness: 160 },
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Minimal Editorial Header (Safe Zone: Y = 110px) */}
            <div
                style={{
                    position: "absolute",
                    top: 110,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transform: `translateY(${(1 - textEntrance) * -20}px)`,
                    opacity: textEntrance,
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
                    THE EDITORIAL DROP
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
                    Two Iconic Looks ✨
                </h1>
            </div>

            {/* Split Screen Cards */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 40,
                    right: 40,
                    height: 1160,
                    display: "flex",
                    gap: 16,
                    zIndex: 10,
                }}
            >
                {/* Left Card: Look 1 Blue Denim */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                        border: "2px solid rgba(107, 164, 232, 0.55)",
                        transform: `translateX(${(1 - leftCard) * -100}px)`,
                        opacity: leftCard,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/chocolate-set/model_front.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            padding: "8px 20px",
                            borderRadius: 99,
                            background: "#6BA4E8",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 17,
                            fontWeight: 800,
                        }}
                    >
                        1. Casual Chic 💙
                    </div>
                </div>

                {/* Right Card: Look 2 Ivory White */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                        transform: `translateX(${(1 - rightCard) * 100}px)`,
                        opacity: rightCard,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/chocolate-set/chocolate-white/combo_4.webp")}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            padding: "8px 20px",
                            borderRadius: 99,
                            background: "#E0A96D",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 17,
                            fontWeight: 800,
                        }}
                    >
                        2. Elevated Ivory 🤍
                    </div>
                </div>

                {/* Center VS Badge */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) scale(${vsEntrance})`,
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "rgba(12, 10, 8, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "'Cinzel', serif",
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#FFFFFF",
                        zIndex: 20,
                    }}
                >
                    VS
                </div>
            </div>

            <ConversionOverlay
                accentColor="#E0A96D"
                ctaPillText='Comment "LINK" for DM ✨'
            />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 2: LOOK 1 CASUAL CHIC (145 - 275 frames / 4.33s)
// =======================================================
const LookOneScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const scale = interpolate(frame, [0, 130], [1.04, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080A0F", overflow: "hidden" }}>
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
                        padding: "8px 24px",
                        borderRadius: 99,
                        background: "#6BA4E8",
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        marginBottom: 8,
                        boxShadow: "0 6px 20px rgba(107, 164, 232, 0.4)",
                    }}
                >
                    LOOK 1 • CASUAL CHIC
                </div>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Flared Blue Denim
                </h2>
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
                    border: "2px solid rgba(107, 164, 232, 0.45)",
                    transform: `scale(${scale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                }}
            >
                <Img
                    src={staticFile("/images/products/chocolate-set/model_front.png")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>

            <ConversionOverlay
                accentColor="#6BA4E8"
                ctaPillText='Comment "1" or "LINK" 👇'
            />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 3: LOOK 2 ELEVATED IVORY (275 - 405 frames / 4.33s)
// =======================================================
const LookTwoScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const scale = interpolate(frame, [0, 130], [1.04, 1.0], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
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
                        padding: "8px 24px",
                        borderRadius: 99,
                        background: "#E0A96D",
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        marginBottom: 8,
                        boxShadow: "0 6px 20px rgba(224, 169, 109, 0.4)",
                    }}
                >
                    LOOK 2 • ELEVATED IVORY
                </div>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Crisp White Linen
                </h2>
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
                    border: "2px solid rgba(224, 169, 109, 0.45)",
                    transform: `scale(${scale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                }}
            >
                <Img
                    src={staticFile("/images/products/chocolate-set/chocolate-white/combo_4.webp")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>

            <ConversionOverlay
                accentColor="#E0A96D"
                ctaPillText='Comment "2" or "LINK" 👇'
            />
        </AbsoluteFill>
    );
};

// =======================================================
// SCENE 4: CLIMAX VOTE (405 - 540 frames / 4.5s)
// =======================================================
const TwoLooksClimaxScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 115,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
                    Which is your aesthetic? ✨
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
                    border: "2px solid rgba(224, 169, 109, 0.35)",
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
                ctaPillText='Comment "1" OR "2" 👇'
            />
        </AbsoluteFill>
    );
};

// =======================================================
// MASTER TWO ICONIC LOOKS COMPOSITION (540 frames / 18.0s)
// =======================================================
export const DayVsNightReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* Subtle Lounge Beat (0.18 Volume) */}
            <Audio
                src={staticFile("/audio/music/music-daynight-lounge.mp3")}
                volume={0.18}
            />

            {/* AI Female Voiceover (Ava) (Crisp at 1.0) */}
            <Sequence from={4}>
                <Audio src={staticFile("/audio/voiceovers/vo-twolooks-intro.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={148}>
                <Audio src={staticFile("/audio/voiceovers/vo-twolooks-look1.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={278}>
                <Audio src={staticFile("/audio/voiceovers/vo-twolooks-look2.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={408}>
                <Audio src={staticFile("/audio/voiceovers/vo-twolooks-cta.mp3")} volume={1.0} />
            </Sequence>

            {/* Synced SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={145} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={275} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={405} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>

            {/* Visuals */}
            <Sequence from={0} durationInFrames={145}>
                <TwoLooksHookScene />
            </Sequence>
            <Sequence from={145} durationInFrames={130}>
                <LookOneScene />
            </Sequence>
            <Sequence from={275} durationInFrames={130}>
                <LookTwoScene />
            </Sequence>
            <Sequence from={405} durationInFrames={135}>
                <TwoLooksClimaxScene />
            </Sequence>
        </AbsoluteFill>
    );
};
