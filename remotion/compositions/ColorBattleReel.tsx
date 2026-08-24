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

const colors = [
    {
        id: "1",
        number: "01",
        name: "CHOCOLATE",
        accent: "#E0A96D",
        image: staticFile("/images/products/chocolate-set/model_front.png"),
        flatImage: staticFile("/images/products/chocolate-set/top_flat.png"),
    },
    {
        id: "2",
        number: "02",
        name: "NAVY BLUE",
        accent: "#6BA4E8",
        image: staticFile("/images/products/chocolate-set/blue/combo_4.webp"),
        flatImage: staticFile("/images/products/chocolate-set/blue/top_1.webp"),
    },
    {
        id: "3",
        number: "03",
        name: "CRIMSON RED",
        accent: "#E26D7D",
        image: staticFile("/images/products/chocolate-set/red/combo_4.webp"),
        flatImage: staticFile("/images/products/chocolate-set/red/top_1.webp"),
    },
    {
        id: "4",
        number: "04",
        name: "MUSTARD GOLD",
        accent: "#F4B860",
        image: staticFile("/images/products/chocolate-set/yellow/combo_4.webp"),
        flatImage: staticFile("/images/products/chocolate-set/yellow/top_1.webp"),
    },
];

// Single Color Slide Component
const ColorSlide: React.FC<{
    item: (typeof colors)[0];
    index: number;
}> = ({ item, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 140 },
    });

    const scale = interpolate(frame, [0, 30], [1.06, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Full Bleed On-Model Image */}
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
                    gap: 20,
                    transform: `translateY(${(1 - entrance) * -25}px)`,
                    opacity: entrance,
                }}
            >
                {/* High Contrast Number Badge */}
                <div
                    style={{
                        width: 76,
                        height: 76,
                        borderRadius: "50%",
                        background: item.accent,
                        color: "#000000",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontFamily: "'Cinzel', serif",
                        fontSize: 32,
                        fontWeight: 900,
                        boxShadow: `0 8px 25px ${item.accent}66`,
                    }}
                >
                    {item.id}
                </div>

                <div>
                    <span
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 16,
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            color: item.accent,
                            textTransform: "uppercase",
                            display: "block",
                        }}
                    >
                        OPTION {item.number}
                    </span>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 48,
                            fontWeight: 700,
                            color: "#FFFFFF",
                            margin: 0,
                            letterSpacing: "-0.01em",
                            textShadow: "0 4px 15px rgba(0,0,0,0.8)",
                        }}
                    >
                        {item.name}
                    </h2>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// 4-Grid Showdown & Comment Bait Climax
const GridShowdown: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const pulse = 1 + Math.sin(frame * 0.25) * 0.03;

    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
            {/* 4-Way Grid */}
            <div
                style={{
                    position: "absolute",
                    top: 260,
                    left: 60,
                    right: 60,
                    height: 1080,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    gap: 16,
                    transform: `scale(${entrance})`,
                    opacity: entrance,
                }}
            >
                {colors.map((c, i) => (
                    <div
                        key={c.id}
                        style={{
                            position: "relative",
                            borderRadius: 24,
                            overflow: "hidden",
                            border: `2px solid ${c.accent}55`,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        }}
                    >
                        <Img
                            src={c.image}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                        {/* Number Badge */}
                        <div
                            style={{
                                position: "absolute",
                                top: 16,
                                left: 16,
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: c.accent,
                                color: "#000000",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontFamily: "'Cinzel', serif",
                                fontSize: 22,
                                fontWeight: 900,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                            }}
                        >
                            {c.id}
                        </div>
                    </div>
                ))}
            </div>

            {/* Instagram Safe Header (Y: 180px) */}
            <div
                style={{
                    position: "absolute",
                    top: 170,
                    left: 60,
                    right: 140,
                    textAlign: "center",
                    transform: `translateY(${(1 - entrance) * -20}px)`,
                    opacity: entrance,
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 52,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        letterSpacing: "-0.01em",
                        margin: 0,
                        textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                    }}
                >
                    WHICH COLOR WINS?
                </h1>
            </div>

            {/* Instagram Safe Comment Call-To-Action (Safe Zone: bottom 280px) */}
            <div
                style={{
                    position: "absolute",
                    bottom: 260,
                    left: 60,
                    right: 60,
                    display: "flex",
                    justifyContent: "center",
                    transform: `scale(${pulse})`,
                }}
            >
                <div
                    style={{
                        padding: "18px 42px",
                        borderRadius: 99,
                        background: "rgba(224, 169, 109, 0.95)",
                        boxShadow: "0 15px 40px rgba(224, 169, 109, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 22,
                            fontWeight: 800,
                            letterSpacing: "0.06em",
                            color: "#0A0908",
                            textTransform: "uppercase",
                        }}
                    >
                        COMMENT 1, 2, 3 OR 4 👇
                    </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const ColorBattleReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#0A0908" }}>
            {/* Slide 1: Chocolate (0 - 28 frames / 0.93s) */}
            <Sequence from={0} durationInFrames={28}>
                <ColorSlide item={colors[0]} index={0} />
            </Sequence>

            {/* Slide 2: Navy Blue (28 - 56 frames / 0.93s) */}
            <Sequence from={28} durationInFrames={28}>
                <ColorSlide item={colors[1]} index={1} />
            </Sequence>

            {/* Slide 3: Crimson Red (56 - 84 frames / 0.93s) */}
            <Sequence from={56} durationInFrames={28}>
                <ColorSlide item={colors[2]} index={2} />
            </Sequence>

            {/* Slide 4: Mustard Gold (84 - 112 frames / 0.93s) */}
            <Sequence from={84} durationInFrames={28}>
                <ColorSlide item={colors[3]} index={3} />
            </Sequence>

            {/* Climax: 4-Way Grid Showdown & Comment Bait (112 - 165 frames / 1.76s) */}
            <Sequence from={112} durationInFrames={53}>
                <GridShowdown />
            </Sequence>
        </AbsoluteFill>
    );
};
