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
import "../styles/remotion.css";

// =======================================================
// ITEM SHOWCASE SCENE
// =======================================================
interface ItemSceneProps {
    title: string;
    imageSrc: string;
    accentColor: string;
    bgGradient: string;
}

const SingleItemScene: React.FC<ItemSceneProps> = ({
    title,
    imageSrc,
    accentColor,
    bgGradient,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const scale = interpolate(frame, [0, 45], [1.04, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: bgGradient }} />

            <div
                style={{
                    position: "absolute",
                    top: 135,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: `translateY(${(1 - entrance) * -16}px)`,
                    opacity: entrance,
                    zIndex: 20,
                }}
            >
                <div
                    style={{
                        padding: "10px 28px",
                        borderRadius: 99,
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(16px)",
                        border: `1px solid ${accentColor}66`,
                        boxShadow: `0 8px 30px ${accentColor}22`,
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: 38,
                            fontWeight: 700,
                            color: "#FFFFFF",
                            margin: 0,
                            letterSpacing: "0.02em",
                        }}
                    >
                        {title}
                    </h2>
                </div>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 240,
                    left: 80,
                    right: 80,
                    height: 1240,
                    borderRadius: 36,
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.75)",
                    border: `2px solid ${accentColor}44`,
                    transform: `scale(${scale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(18, 15, 13, 0.6)",
                }}
            >
                <Img
                    src={imageSrc}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>
        </AbsoluteFill>
    );
};

// =======================================================
// FULL LOOK SCENE
// =======================================================
const FullLookScene: React.FC<{
    frontImg: string;
    backImg: string;
    sideImg: string;
    accentColor: string;
}> = ({ frontImg, backImg, sideImg, accentColor }) => {
    const frame = useCurrentFrame();

    let currentImage = frontImg;
    let subFrame = frame;

    if (frame < 35) {
        currentImage = frontImg;
        subFrame = frame;
    } else if (frame < 70) {
        currentImage = backImg;
        subFrame = frame - 35;
    } else {
        currentImage = sideImg;
        subFrame = frame - 70;
    }

    const scale = interpolate(subFrame, [0, 35], [1.03, 1.0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 135,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 20,
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 52,
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: 0,
                        textShadow: "0 4px 25px rgba(0,0,0,0.9)",
                    }}
                >
                    The Full Fit ✨
                </h1>
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 230,
                    left: 80,
                    right: 80,
                    height: 1220,
                    borderRadius: 36,
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.8)",
                    border: `2px solid ${accentColor}55`,
                    transform: `scale(${scale})`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Img
                    src={currentImage}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 300,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 20,
                }}
            >
                <span
                    style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 16,
                        letterSpacing: "0.3em",
                        color: "rgba(255, 255, 255, 0.45)",
                        textTransform: "uppercase",
                    }}
                >
                    tenet
                </span>
            </div>
        </AbsoluteFill>
    );
};

// =======================================================
// MASTER SAMPLE REEL WITH AI NEURAL VOICEOVER
// =======================================================
export const SampleVoiceoverReel: React.FC = () => {
    const accentColor = "#E0A96D";
    const bgGradient = "radial-gradient(circle at 50% 50%, #100D0A 0%, #060504 80%)";

    return (
        <AbsoluteFill style={{ backgroundColor: "#080706" }}>
            {/* 1. Background Music (Ducked slightly to 0.45 for voice clarity) */}
            <Audio
                src={staticFile("/audio/music/viral-fashion-outfit-beat-9s.mp3")}
                volume={0.45}
            />

            {/* 2. Synchronized AI Neural Voiceover Clips (Ava) */}
            {/* "This top." */}
            <Sequence from={6} durationInFrames={35}>
                <Audio src={staticFile("/audio/voiceovers/p1-top.mp3")} volume={1.0} />
            </Sequence>

            {/* "Plus this denim." */}
            <Sequence from={48} durationInFrames={35}>
                <Audio src={staticFile("/audio/voiceovers/p2-denim.mp3")} volume={1.0} />
            </Sequence>

            {/* "Plus these crystal heels." */}
            <Sequence from={93} durationInFrames={38}>
                <Audio src={staticFile("/audio/voiceovers/p3-heels.mp3")} volume={1.0} />
            </Sequence>

            {/* "Here is the full fit." */}
            <Sequence from={138} durationInFrames={45}>
                <Audio src={staticFile("/audio/voiceovers/p4-fit.mp3")} volume={1.0} />
            </Sequence>

            {/* 3. Synced SFX */}
            <Sequence from={0} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={45} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.4} />
            </Sequence>
            <Sequence from={90} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/sparkle.wav")} volume={0.45} />
            </Sequence>
            <Sequence from={135} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/whoosh.wav")} volume={0.5} />
            </Sequence>
            <Sequence from={135} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.5} />
            </Sequence>
            <Sequence from={170} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.5} />
            </Sequence>
            <Sequence from={205} durationInFrames={15}>
                <Audio src={staticFile("/audio/sfx/shutter.wav")} volume={0.5} />
            </Sequence>

            {/* 4. Visual Sequences */}
            <Sequence from={0} durationInFrames={45}>
                <SingleItemScene
                    title="THIS TOP"
                    imageSrc={staticFile("/images/products/chocolate-set/top_flat.png")}
                    accentColor={accentColor}
                    bgGradient={bgGradient}
                />
            </Sequence>

            <Sequence from={45} durationInFrames={45}>
                <SingleItemScene
                    title="+ THIS DENIM"
                    imageSrc={staticFile("/images/products/chocolate-set/bottom_flat.jpg")}
                    accentColor={accentColor}
                    bgGradient={bgGradient}
                />
            </Sequence>

            <Sequence from={90} durationInFrames={45}>
                <SingleItemScene
                    title="+ THESE HEELS"
                    imageSrc={staticFile("/images/products/chocolate-set/shoes.png")}
                    accentColor={accentColor}
                    bgGradient={bgGradient}
                />
            </Sequence>

            <Sequence from={135} durationInFrames={105}>
                <FullLookScene
                    frontImg={staticFile("/images/products/chocolate-set/model_front.png")}
                    backImg={staticFile("/images/products/chocolate-set/model_back.png")}
                    sideImg={staticFile("/images/products/chocolate-set/model_side.png")}
                    accentColor={accentColor}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
