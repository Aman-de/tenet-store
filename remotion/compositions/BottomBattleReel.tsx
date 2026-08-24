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

// ==========================================
// SCENE 1: SLIDING SPLIT FACE-OFF HOOK
// ==========================================
const SplitHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 130 },
    });

    const leftSlide = spring({
        frame: frame - 2,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const rightSlide = spring({
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
            {/* Centered Top Hook */}
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
                        padding: "6px 18px",
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
                    STYLE BATTLE
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
                    Blue Denim or White Pant?
                </h1>
            </div>

            {/* Sliding Split Screen Cards */}
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
                {/* Left Card: Blue Denim (Sliding from Left) */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                        border: "2px solid rgba(107, 164, 232, 0.55)",
                        transform: `translateX(${(1 - leftSlide) * -100}px)`,
                        opacity: leftSlide,
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
                            fontSize: 18,
                            fontWeight: 800,
                            boxShadow: "0 4px 20px rgba(107, 164, 232, 0.4)",
                        }}
                    >
                        1. Blue Denim 💙
                    </div>
                </div>

                {/* Right Card: White Pant (Sliding from Right) */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                        border: "2px solid rgba(255, 255, 255, 0.55)",
                        transform: `translateX(${(1 - rightSlide) * 100}px)`,
                        opacity: rightSlide,
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
                            background: "#FFFFFF",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 18,
                            fontWeight: 800,
                            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.4)",
                        }}
                    >
                        2. White Pant 🤍
                    </div>
                </div>

                {/* Center VS Badge with Scale Spring */}
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
                        boxShadow: "0 10px 30px rgba(0,0,0,0.9)",
                        zIndex: 20,
                    }}
                >
                    VS
                </div>
            </div>

            <ConversionOverlay
                accentColor="#E0A96D"
                ctaPillText='Comment "1" OR "2" 👇'
            />
        </AbsoluteFill>
    );
};

// ==========================================
// SCENE 2: OPTION 1 BLUE DENIM
// ==========================================
const OptionBlueScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const scale = interpolate(frame, [0, 85], [1.04, 1.0], { extrapolateRight: "clamp" });

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
                    OPTION 1 💙
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

// ==========================================
// SCENE 3: OPTION 2 WHITE PANT
// ==========================================
const OptionWhiteScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const scale = interpolate(frame, [0, 75], [1.04, 1.0], { extrapolateRight: "clamp" });

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
                        background: "#FFFFFF",
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        marginBottom: 8,
                        boxShadow: "0 6px 20px rgba(255, 255, 255, 0.4)",
                    }}
                >
                    OPTION 2 🤍
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
                    Crisp White Pant
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
                    border: "2px solid rgba(255, 255, 255, 0.45)",
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
                accentColor="#FFFFFF"
                ctaPillText='Comment "2" or "LINK" 👇'
            />
        </AbsoluteFill>
    );
};

// ==========================================
// SCENE 4: CLIMAX VOTE
// ==========================================
const ClimaxVoteScene: React.FC = () => {
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
                        fontSize: 50,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    Which is better? 👇
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

// ==========================================
// MASTER BOTTOM BATTLE COMPOSITION
// ==========================================
export const BottomBattleReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* Lowered Music Volume to 0.18 */}
            <Audio
                src={staticFile("/audio/music/music-battle-energy.mp3")}
                volume={0.18}
            />

            {/* AI Female Voiceover (Ava) (Crisp at 1.0) */}
            <Sequence from={4}>
                <Audio src={staticFile("/audio/voiceovers/vo-battle-intro.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={84}>
                <Audio src={staticFile("/audio/voiceovers/vo-battle-opt1.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={169}>
                <Audio src={staticFile("/audio/voiceovers/vo-battle-opt2.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={245}>
                <Audio src={staticFile("/audio/voiceovers/vo-battle-cta.mp3")} volume={1.0} />
            </Sequence>

            {/* Synced SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={80} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={165} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={240} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>

            {/* Visual Sequences */}
            <Sequence from={0} durationInFrames={80}>
                <SplitHookScene />
            </Sequence>
            <Sequence from={80} durationInFrames={85}>
                <OptionBlueScene />
            </Sequence>
            <Sequence from={165} durationInFrames={75}>
                <OptionWhiteScene />
            </Sequence>
            <Sequence from={240} durationInFrames={110}>
                <ClimaxVoteScene />
            </Sequence>
        </AbsoluteFill>
    );
};
