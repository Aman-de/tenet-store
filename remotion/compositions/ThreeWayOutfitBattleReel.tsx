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

const fitsData = [
    {
        num: "1",
        title: "Chocolate Brown",
        badge: "FIT 1 • RICH CHOCOLATE 🤎",
        color: "#E0A96D",
        image: staticFile("/images/products/chocolate-set/model_front.png"),
    },
    {
        num: "2",
        title: "Royal Navy Blue",
        badge: "FIT 2 • MIDNIGHT NAVY 💙",
        color: "#6BA4E8",
        image: staticFile("/images/products/chocolate-set/blue/combo_4.webp"),
    },
    {
        num: "3",
        title: "Crimson Wine Red",
        badge: "FIT 3 • CRIMSON RED 🍷",
        color: "#E26D7D",
        image: staticFile("/images/products/chocolate-set/red/combo_4.webp"),
    },
];

// =======================================================
// SCENE 1: 3-WAY ANIMATED SHOWDOWN HOOK (0 - 140 frames / 4.66s)
// =======================================================
const ThreeWayHookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleEntrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 130 },
    });

    const card1 = spring({ frame: frame - 2, fps, config: { damping: 12, stiffness: 140 } });
    const card2 = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 140 } });
    const card3 = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 140 } });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            {/* Header (Safe Zone: Y = 110px) */}
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
                    🔥 3 WAYS TO STYLE • OUTFIT CLASH
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
                    Which fit is your vibe? ✨
                </h1>
            </div>

            {/* 3-Card Staggered Animated Showcase */}
            <div
                style={{
                    position: "absolute",
                    top: 235,
                    left: 30,
                    right: 30,
                    height: 1160,
                    display: "flex",
                    gap: 12,
                    zIndex: 10,
                }}
            >
                {/* Card 1: Chocolate */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 24,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                        border: "2px solid rgba(224, 169, 109, 0.6)",
                        transform: `translateY(${(1 - card1) * 60}px)`,
                        opacity: card1,
                    }}
                >
                    <Img
                        src={fitsData[0].image}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            left: 12,
                            padding: "6px 14px",
                            borderRadius: 99,
                            background: "#E0A96D",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 15,
                            fontWeight: 900,
                        }}
                    >
                        1 🤎
                    </div>
                </div>

                {/* Card 2: Navy Blue */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 24,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                        border: "2px solid rgba(107, 164, 232, 0.6)",
                        transform: `translateY(${(1 - card2) * 60}px)`,
                        opacity: card2,
                    }}
                >
                    <Img
                        src={fitsData[1].image}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            left: 12,
                            padding: "6px 14px",
                            borderRadius: 99,
                            background: "#6BA4E8",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 15,
                            fontWeight: 900,
                        }}
                    >
                        2 💙
                    </div>
                </div>

                {/* Card 3: Crimson Red */}
                <div
                    style={{
                        flex: 1,
                        borderRadius: 24,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
                        border: "2px solid rgba(226, 109, 125, 0.6)",
                        transform: `translateY(${(1 - card3) * 60}px)`,
                        opacity: card3,
                    }}
                >
                    <Img
                        src={fitsData[2].image}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            left: 12,
                            padding: "6px 14px",
                            borderRadius: 99,
                            background: "#E26D7D",
                            color: "#0A0908",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 15,
                            fontWeight: 900,
                        }}
                    >
                        3 🍷
                    </div>
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
// SINGLE FIT SHOWCASE SCENE
// =======================================================
const SingleFitScene: React.FC<{
    item: (typeof fitsData)[0];
    durationInFrames: number;
}> = ({ item, durationInFrames }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
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
                        padding: "8px 24px",
                        borderRadius: 99,
                        background: item.color,
                        color: "#0A0908",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16,
                        fontWeight: 900,
                        marginBottom: 8,
                        boxShadow: `0 6px 20px ${item.color}44`,
                    }}
                >
                    {item.badge}
                </div>
                <h2
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 46,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                    }}
                >
                    {item.title}
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
                    border: `2px solid ${item.color}55`,
                    transform: `scale(${scale * entrance})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: `0 25px 60px rgba(0,0,0,0.85), 0 0 25px ${item.color}22`,
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

// =======================================================
// MASTER 3-WAY OUTFIT BATTLE (620 frames / 20.66s)
// =======================================================
export const ThreeWayOutfitBattleReel: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* Subtle R&B Battle Soundtrack (0.18 Volume) */}
            <Audio
                src={staticFile("/audio/music/music-3way-battle.mp3")}
                volume={0.18}
            />

            {/* AI Female Voiceover (Ava) */}
            <Sequence from={4}>
                <Audio src={staticFile("/audio/voiceovers/vo-3way-intro.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={144}>
                <Audio src={staticFile("/audio/voiceovers/vo-3way-fit1.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={254}>
                <Audio src={staticFile("/audio/voiceovers/vo-3way-fit2.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={369}>
                <Audio src={staticFile("/audio/voiceovers/vo-3way-fit3.mp3")} volume={1.0} />
            </Sequence>

            <Sequence from={489}>
                <Audio src={staticFile("/audio/voiceovers/vo-3way-cta.mp3")} volume={1.0} />
            </Sequence>

            {/* SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
            <Sequence from={140} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={250} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={365} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={485} durationInFrames={20}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>

            {/* Visuals */}
            {/* Beat 1: 3-Way Showcase Hook (0 to 140 frames) */}
            <Sequence from={0} durationInFrames={140}>
                <ThreeWayHookScene />
            </Sequence>

            {/* Beat 2: Fit 1 Chocolate (140 to 250 frames) */}
            <Sequence from={140} durationInFrames={110}>
                <SingleFitScene item={fitsData[0]} durationInFrames={110} />
            </Sequence>

            {/* Beat 3: Fit 2 Navy Blue (250 to 365 frames) */}
            <Sequence from={250} durationInFrames={115}>
                <SingleFitScene item={fitsData[1]} durationInFrames={115} />
            </Sequence>

            {/* Beat 4: Fit 3 Crimson Red (365 to 485 frames) */}
            <Sequence from={365} durationInFrames={120}>
                <SingleFitScene item={fitsData[2]} durationInFrames={120} />
            </Sequence>

            {/* Beat 5: Climax Vote & CTA (485 to 620 frames) */}
            <Sequence from={485} durationInFrames={135}>
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
                            Which fit are you wearing? 👇
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
                        ctaPillText='Comment "1, 2, 3" OR "LINK" 👇'
                    />
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
