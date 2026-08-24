import React from "react";
import {
    AbsoluteFill,
    Img,
    interpolate,
    Sequence,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import "../styles/remotion.css";

const optionA = {
    label: "OPTION A",
    name: "CHOCOLATE",
    emoji: "🤎",
    accent: "#E0A96D",
    image: staticFile("/images/products/chocolate-set/model_front.png"),
};

const optionB = {
    label: "OPTION B",
    name: "ROYAL NAVY",
    emoji: "💙",
    accent: "#6BA4E8",
    image: staticFile("/images/products/chocolate-set/blue/combo_4.webp"),
};

// Split Intro & Outro Screen
const SplitVersus: React.FC<{ isOutro?: boolean }> = ({ isOutro }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const pulse = 1 + Math.sin(frame * 0.25) * 0.04;

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
            {/* Left Half: Option A (Chocolate) */}
            <div
                style={{
                    position: "absolute",
                    top: 250,
                    bottom: 260,
                    left: 50,
                    width: 470,
                    borderRadius: 24,
                    overflow: "hidden",
                    border: "2px solid rgba(224, 169, 109, 0.4)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                }}
            >
                <Img
                    src={optionA.image}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                {/* Badge A */}
                <div
                    style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        padding: "8px 18px",
                        borderRadius: 99,
                        background: optionA.accent,
                        color: "#000000",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                    }}
                >
                    A {optionA.emoji}
                </div>
            </div>

            {/* Right Half: Option B (Navy) */}
            <div
                style={{
                    position: "absolute",
                    top: 250,
                    bottom: 260,
                    right: 50,
                    width: 470,
                    borderRadius: 24,
                    overflow: "hidden",
                    border: "2px solid rgba(107, 164, 232, 0.4)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                }}
            >
                <Img
                    src={optionB.image}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
                {/* Badge B */}
                <div
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        padding: "8px 18px",
                        borderRadius: 99,
                        background: optionB.accent,
                        color: "#000000",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                    }}
                >
                    B {optionB.emoji}
                </div>
            </div>

            {/* Center VS Badge */}
            <div
                style={{
                    position: "absolute",
                    top: "46%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(10, 9, 8, 0.92)",
                    backdropFilter: "blur(12px)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Cinzel', serif",
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#FFFFFF",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.8)",
                    zIndex: 20,
                }}
            >
                VS
            </div>

            {/* Instagram Safe Header (Y: 170px) */}
            <div
                style={{
                    position: "absolute",
                    top: 165,
                    left: 60,
                    right: 60,
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -20}px)`,
                    opacity: entrance,
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 54,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        letterSpacing: "-0.01em",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                    }}
                >
                    {isOutro ? "LEFT OR RIGHT?" : "THIS OR THAT?"}
                </h1>
            </div>

            {/* Instagram Safe Bottom Prompt (Safe Zone: bottom 250px) */}
            <div
                style={{
                    position: "absolute",
                    bottom: 240,
                    left: 60,
                    right: 60,
                    display: "flex",
                    justifyContent: "center",
                    transform: `scale(${pulse})`,
                }}
            >
                <div
                    style={{
                        padding: "16px 40px",
                        borderRadius: 99,
                        background: "rgba(255, 255, 255, 0.95)",
                        boxShadow: "0 15px 40px rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 20,
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            color: "#0A0908",
                            textTransform: "uppercase",
                        }}
                    >
                        {isOutro ? "VOTE A OR B IN COMMENTS 👇" : "WHICH ONE IS YOURS?"}
                    </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// Full Screen Single Option Feature
const OptionFeature: React.FC<{
    item: typeof optionA;
}> = ({ item }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const scale = interpolate(frame, [0, 42], [1.06, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: `scale(${scale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={item.image}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>

            {/* Gradient Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to bottom, rgba(10, 8, 6, 0.7) 0%, transparent 25%, transparent 70%, rgba(10, 8, 6, 0.85) 100%)",
                }}
            />

            {/* Instagram Safe Zone Header (Y: 200px) */}
            <div
                style={{
                    position: "absolute",
                    top: 200,
                    left: 80,
                    right: 140,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    transform: `translateY(${(1 - entrance) * -20}px)`,
                    opacity: entrance,
                }}
            >
                <div
                    style={{
                        padding: "10px 24px",
                        borderRadius: 99,
                        background: item.accent,
                        color: "#000000",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        boxShadow: `0 8px 25px ${item.accent}66`,
                    }}
                >
                    {item.label} {item.emoji}
                </div>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 52,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 15px rgba(0,0,0,0.8)",
                    }}
                >
                    {item.name}
                </h2>
            </div>
        </AbsoluteFill>
    );
};

export const ThisOrThatReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908" }}>
            {/* Scene 1: Split Intro (0 - 32 frames / 1.06s) */}
            <Sequence from={0} durationInFrames={32}>
                <SplitVersus isOutro={false} />
            </Sequence>

            {/* Scene 2: Option A Feature (32 - 74 frames / 1.4s) */}
            <Sequence from={32} durationInFrames={42}>
                <OptionFeature item={optionA} />
            </Sequence>

            {/* Scene 3: Option B Feature (74 - 116 frames / 1.4s) */}
            <Sequence from={74} durationInFrames={42}>
                <OptionFeature item={optionB} />
            </Sequence>

            {/* Scene 4: Split Outro & Voting Call to Action (116 - 165 frames / 1.63s) */}
            <Sequence from={116} durationInFrames={49}>
                <SplitVersus isOutro={true} />
            </Sequence>
        </AbsoluteFill>
    );
};
