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
// SCENE 1: CENTERED SPLIT HOOK (0 - 60 frames / 2.0s)
// ==========================================
const CenteredHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const textEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 140 },
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

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Centered Top Hook Header */}
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
                    VIRAL POLL
                </div>
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        letterSpacing: "-0.01em",
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    Which one are you wearing?
                </h1>
            </div>

            {/* Split Screen Container */}
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
                {/* Left Card: Option 1 (Chocolate) */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                        border: "2px solid rgba(224, 169, 109, 0.5)",
                        transform: `translateX(${(1 - leftSlide) * -100}px)`,
                        opacity: leftSlide,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/chocolate-set/model_front.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            padding: "8px 20px",
                            borderRadius: 99,
                            background: "#E0A96D",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 18,
                            fontWeight: 800,
                            letterSpacing: "0.05em",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                        }}
                    >
                        1 🤎
                    </div>
                </div>

                {/* Right Card: Option 2 (Navy Blue) */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 28,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
                        border: "2px solid rgba(107, 164, 232, 0.5)",
                        transform: `translateX(${(1 - rightSlide) * 100}px)`,
                        opacity: rightSlide,
                    }}
                >
                    <Img
                        src={staticFile("/images/products/chocolate-set/blue/combo_4.webp")}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            padding: "8px 20px",
                            borderRadius: 99,
                            background: "#6BA4E8",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 18,
                            fontWeight: 800,
                            letterSpacing: "0.05em",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                        }}
                    >
                        2 💙
                    </div>
                </div>

                {/* Center VS Badge */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "rgba(12, 10, 8, 0.95)",
                        backdropFilter: "blur(12px)",
                        border: "2px solid rgba(255, 255, 255, 0.4)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "'Cinzel', serif",
                        fontSize: 22,
                        fontWeight: 900,
                        color: "#FFFFFF",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.9)",
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
// SCENE 2: OPTION 1 - CHOCOLATE
// ==========================================
const OptionOneScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const scale = interpolate(frame, [0, 85], [1.04, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 50% 50%, #1A130D 0%, #060504 80%)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: 115,
                    left: 0,
                    right: 0,
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
                        padding: "8px 24px",
                        borderRadius: 99,
                        background: "#E0A96D",
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                        marginBottom: 8,
                        boxShadow: "0 8px 25px rgba(224, 169, 109, 0.5)",
                    }}
                >
                    OPTION 1 🤎
                </div>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                    }}
                >
                    Chocolate Brown
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
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    border: "2px solid rgba(224, 169, 109, 0.4)",
                    transform: `scale(${scale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={staticFile("/images/products/chocolate-set/model_front.png")}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            <ConversionOverlay
                accentColor="#E0A96D"
                ctaPillText='Comment "1" or "LINK" 👇'
            />
        </AbsoluteFill>
    );
};

// ==========================================
// SCENE 3: OPTION 2 - NAVY BLUE
// ==========================================
const OptionTwoScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const scale = interpolate(frame, [0, 85], [1.04, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080A0F", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "radial-gradient(circle at 50% 50%, #101726 0%, #04060A 80%)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: 115,
                    left: 0,
                    right: 0,
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
                        padding: "8px 24px",
                        borderRadius: 99,
                        background: "#6BA4E8",
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        letterSpacing: "0.1em",
                        marginBottom: 8,
                        boxShadow: "0 8px 25px rgba(107, 164, 232, 0.5)",
                    }}
                >
                    OPTION 2 💙
                </div>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 48,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                    }}
                >
                    Royal Navy Blue
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
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    border: "2px solid rgba(107, 164, 232, 0.4)",
                    transform: `scale(${scale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={staticFile("/images/products/chocolate-set/blue/combo_4.webp")}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            <ConversionOverlay
                accentColor="#6BA4E8"
                ctaPillText='Comment "2" or "LINK" 👇'
            />
        </AbsoluteFill>
    );
};

// ==========================================
// SCENE 4: DETAILS CUT & VIRAL COMMENT CLIMAX
// ==========================================
const DetailsClimaxScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const isSide = frame >= 32;
    const currentImage = isSide
        ? staticFile("/images/products/chocolate-set/model_side.png")
        : staticFile("/images/products/chocolate-set/model_back.png");

    const cutFrame = isSide ? frame - 32 : frame;
    const scale = interpolate(cutFrame, [0, 32], [1.04, 1.0], {
        extrapolateRight: "clamp",
    });

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
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    Drop your fav below 👇
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
                    boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
                    border: "2px solid rgba(224, 169, 109, 0.35)",
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

            <ConversionOverlay
                accentColor="#E0A96D"
                ctaPillText='Comment "1" OR "2" 👇'
            />
        </AbsoluteFill>
    );
};

// ==========================================
// MASTER SEAMLESS COMPOSITION
// ==========================================
export const MasterViralReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* Lowered Music Volume to 0.18 */}
            <Audio
                src={staticFile("/audio/music/music-chocolate-rnb.mp3")}
                volume={0.18}
            />

            {/* AI Female Voiceover (Ava) (Crisp at 1.0) */}
            <Sequence from={4}>
                <Audio src={staticFile("/audio/voiceovers/vo-master-intro.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={64}>
                <Audio src={staticFile("/audio/voiceovers/vo-master-opt1.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={149}>
                <Audio src={staticFile("/audio/voiceovers/vo-master-opt2.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={234}>
                <Audio src={staticFile("/audio/voiceovers/vo-master-cta.mp3")} volume={1.0} />
            </Sequence>

            {/* Synced SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={8} durationInFrames={10}>
                <Audio src={staticFile("/audio/sfx/pop.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={60} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={145} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={230} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={240} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.4} />
            </Sequence>

            {/* Visuals */}
            <Sequence from={0} durationInFrames={60}>
                <CenteredHookScene />
            </Sequence>
            <Sequence from={60} durationInFrames={85}>
                <OptionOneScene />
            </Sequence>
            <Sequence from={145} durationInFrames={85}>
                <OptionTwoScene />
            </Sequence>
            <Sequence from={230} durationInFrames={65}>
                <DetailsClimaxScene />
            </Sequence>
        </AbsoluteFill>
    );
};
