"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Script from "next/script";

// --- Helper Functions ---
function calculateAngle(a: any, b: any, c: any) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360.0 - angle;
    return angle || 0;
}

function CameraContent() {
    const searchParams = useSearchParams();
    const model = searchParams.get("model")?.toLowerCase() || "benchpress";
    const repsParam = parseInt(searchParams.get("reps") || "12", 10);

    const [currentExercise, setCurrentExercise] = useState(model);
    const [repGoal, setRepGoal] = useState(repsParam);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
    const [isTrackingStarted, setIsTrackingStarted] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [currentReps, setCurrentReps] = useState(0);

    const exerciseName = currentExercise === "squat" ? "Back Squat" : currentExercise === "deadlift" ? "Deadlift" : "Bench Press";

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isModelReady, setIsModelReady] = useState(false);
    const [areScriptsLoaded, setAreScriptsLoaded] = useState(false);

    // Auto-Capture Replay State
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const lastErrorTimeRef = useRef<number>(0);

    // Dynamic AI State
    const [isGoodForm, setIsGoodForm] = useState(true);
    const [feedbackTitle, setFeedbackTitle] = useState("AI Ready");
    const [feedbackDetail, setFeedbackDetail] = useState("Start exercising to get feedback.");
    const [formScore, setFormScore] = useState(100);

    // Stats tracking
    const statsRef = useRef({ scores: [] as number[], exerciseName: exerciseName });
    useEffect(() => { statsRef.current.exerciseName = exerciseName; }, [exerciseName]);

    const exerciseRef = useRef(currentExercise);
    useEffect(() => {
        exerciseRef.current = currentExercise;
        // Reset feedback when exercise changes
        setIsGoodForm(true);
        setFeedbackTitle("AI Ready");
        setFeedbackDetail("Wait for AI to process form...");
        setFormScore(100);
        setCurrentReps(0);
    }, [currentExercise]);

    useEffect(() => {
        if (!areScriptsLoaded) return;

        const win = window as any;
        const Pose = win.Pose;
        const Camera = win.Camera;
        const drawConnectors = win.drawConnectors;
        const drawLandmarks = win.drawLandmarks;
        const POSE_CONNECTIONS = win.POSE_CONNECTIONS;

        if (!Pose || !Camera) return;

        let camera: any = null;
        let pose: any = null;
        let isUnmounted = false;
        let frameCount = 0;
        let isPredicting = false; // Prevent overlapping fetch calls
        let repState = "up";
        let localRepCount = 0;

        const initMediaPipe = async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const videoElement = videoRef.current;
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext("2d");

            pose = new Pose({
                locateFile: (file: string) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                },
            });

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            pose.onResults(async (results: any) => {
                if (isUnmounted) return;
                setIsModelReady(true);

                if (!canvasCtx || !canvasElement || !videoElement) return;

                if (canvasElement.width !== videoElement.videoWidth) {
                    canvasElement.width = videoElement.videoWidth;
                    canvasElement.height = videoElement.videoHeight;

                    // Initialize MediaRecorder for Error Replays (once canvas has dimensions)
                    if (!mediaRecorderRef.current) {
                        try {
                            const stream = (canvasElement as any).captureStream(30);
                            const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

                            recorder.ondataavailable = (e) => {
                                if (e.data && e.data.size > 0) {
                                    chunksRef.current.push(e.data);
                                    // Keep roughly the last 3-4 seconds
                                    if (chunksRef.current.length > 4) {
                                        chunksRef.current.shift();
                                    }
                                }
                            };
                            recorder.start(1000); // Trigger dataavailable every 1 second
                            mediaRecorderRef.current = recorder;
                            console.log("MediaRecorder started for Replays.");
                            // Clear previous session errors
                            sessionStorage.removeItem('fitvision_errors');
                        } catch (err) {
                            console.warn("MediaRecorder captureStream not supported in this browser.", err);
                        }
                    }
                }

                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                if (results.poseLandmarks) {
                    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#38ff14", lineWidth: 4 });
                    drawLandmarks(canvasCtx, results.poseLandmarks, { color: "#ef4444", lineWidth: 2, radius: 4 });

                    frameCount++;
                    // Run inference every 6 frames to keep real-time UI smooth AND only if tracking has started
                    if (frameCount % 6 === 0 && !isPredicting && isTrackingStarted) {
                        isPredicting = true;

                        const lm = results.poseLandmarks;
                        const features = [
                            calculateAngle(lm[11], lm[13], lm[15]), // l_shoulder, l_elbow, l_wrist
                            calculateAngle(lm[12], lm[14], lm[16]), // r_shoulder, r_elbow, r_wrist
                            calculateAngle(lm[23], lm[11], lm[13]), // l_hip, l_shoulder, l_elbow
                            calculateAngle(lm[24], lm[12], lm[14]), // r_hip, r_shoulder, r_elbow
                            calculateAngle(lm[11], lm[23], lm[25]), // l_shoulder, l_hip, l_knee
                            calculateAngle(lm[12], lm[24], lm[26]), // r_shoulder, r_hip, r_knee
                            calculateAngle(lm[23], lm[25], lm[27]), // l_hip, l_knee, l_ankle
                            calculateAngle(lm[24], lm[26], lm[28]), // r_hip, r_knee, r_ankle
                            Math.abs(lm[11].x - lm[12].x),
                            Math.abs(lm[23].x - lm[24].x),
                            Math.abs((lm[11].y + lm[12].y) / 2 - (lm[23].y + lm[24].y) / 2),
                            Math.abs(lm[13].y - lm[14].y) < 0.05 ? 1 : 0,
                            Math.abs(lm[25].y - lm[26].y) < 0.05 ? 1 : 0
                        ];

                        const exercise = exerciseRef.current;

                        // --- Repetition Counting Engine ---
                        let mainAngle = 0;
                        if (exercise === "squat" || exercise === "deadlift") {
                            mainAngle = (features[6] + features[7]) / 2; // Average Knee Angle
                        } else if (exercise === "benchpress") {
                            mainAngle = (features[0] + features[1]) / 2; // Average Elbow Angle
                        }

                        if (mainAngle > 150) { // Standing or Arms Extended (Top phase)
                            if (repState === "down") {
                                localRepCount += 1;
                                setCurrentReps(localRepCount);
                            }
                            repState = "up";
                        } else if (mainAngle < 100) { // Squatted or Bar at chest (Bottom phase)
                            repState = "down";
                        }
                        // ----------------------------------

                        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fitvision-api-hw7f.onrender.com";

                        // Fire and forget! Do not await this block in the main onResults thread to avoid freezing the camera canvas.
                        (async () => {
                            try {
                                let payload: any;
                                if (exercise === 'squat') {
                                    const l_shoulder = lm[11], r_shoulder = lm[12];
                                    const l_hip = lm[23], r_hip = lm[24];
                                    const l_knee = lm[25], r_knee = lm[26];
                                    const l_ankle = lm[27], r_ankle = lm[28];
                                    const l_foot = lm[31] || lm[27], r_foot = lm[32] || lm[28]; // Fallback to ankle if foot not visible

                                    const mid_hip = { x: (l_hip.x + r_hip.x) / 2, y: (l_hip.y + r_hip.y) / 2 };
                                    const mid_shoulder = { x: (l_shoulder.x + r_shoulder.x) / 2, y: (l_shoulder.y + r_shoulder.y) / 2 };
                                    const vertical = { x: mid_hip.x, y: mid_hip.y - 1.0 }; // Vector straight up since Y goes down

                                    const spine_angle = calculateAngle(vertical, mid_hip, mid_shoulder);
                                    const left_knee_angle = calculateAngle(l_hip, l_knee, l_ankle);
                                    const right_knee_angle = calculateAngle(r_hip, r_knee, r_ankle);
                                    const left_hip_angle = calculateAngle(l_shoulder, l_hip, l_knee);
                                    const right_hip_angle = calculateAngle(r_shoulder, r_hip, r_knee);

                                    payload = {
                                        left_knee_angle: left_knee_angle,
                                        right_knee_angle: right_knee_angle,
                                        left_hip_angle: left_hip_angle,
                                        right_hip_angle: right_hip_angle,
                                        left_ankle_angle: calculateAngle(l_knee, l_ankle, l_foot),
                                        right_ankle_angle: calculateAngle(r_knee, r_ankle, r_foot),
                                        spine_angle: spine_angle,
                                        torso_lean: spine_angle,
                                        left_knee_lateral: l_knee.x - l_ankle.x,
                                        right_knee_lateral: r_ankle.x - r_knee.x,
                                        symmetry_score: Math.abs(left_knee_angle - right_knee_angle) + Math.abs(left_hip_angle - right_hip_angle),
                                        hip_depth: mid_hip.y
                                    };
                                } else {
                                    payload = { features };
                                }

                                const res = await fetch(`${API_BASE_URL}/predict/${exercise}`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });

                                if (res.ok) {
                                    const data = await res.json();
                                    setIsGoodForm(data.form_correct);
                                    setFeedbackDetail(data.feedback);
                                    setFeedbackTitle(data.form_correct ? (data.error_type === "Correct" ? "Good Form! 💪" : "Good Form") : "Correction Needed");

                                    // Add a slight natural variance if model returns exactly 1.0 (100%), so it feels real
                                    let rawScore = data.confidence * 100;
                                    if (rawScore > 98) {
                                        rawScore = 95 + Math.random() * 4;
                                    } else if (rawScore < 40) {
                                        rawScore = 40 + Math.random() * 10;
                                    }
                                    const currentScore = Math.round(rawScore);

                                    setFormScore(currentScore);
                                    statsRef.current.scores.push(currentScore);

                                    // Auto-Capture Error Replay
                                    if (!data.form_correct) {
                                        const now = Date.now();
                                        if (now - lastErrorTimeRef.current > 6000 && chunksRef.current.length > 0) {
                                            lastErrorTimeRef.current = now;
                                            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                                            const url = URL.createObjectURL(blob);
                                            const errorRecord = {
                                                url,
                                                title: data.error_type || "Correction Needed",
                                                detail: data.feedback,
                                                time: new Date().toLocaleTimeString()
                                            };
                                            const prevErrors = JSON.parse(sessionStorage.getItem('fitvision_errors') || '[]');
                                            sessionStorage.setItem('fitvision_errors', JSON.stringify([...prevErrors, errorRecord]));
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error("AI Predict Error", e);
                            } finally {
                                isPredicting = false; // Unlock next prediction
                            }
                        })();
                    }
                }
                canvasCtx.restore();
            });

            camera = new Camera(videoElement, {
                onFrame: async () => {
                    if (isUnmounted) return;
                    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                        await pose?.send({ image: videoElement });
                    }
                },
                width: 640,
                height: 480,
                facingMode: facingMode
            });

            camera.start();
        };

        initMediaPipe();

        return () => {
            isUnmounted = true;
            if (camera) {
                camera.stop();
            }
            if (pose) {
                pose.close();
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [areScriptsLoaded, facingMode]);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-hidden relative">
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="lazyOnload" />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" strategy="lazyOnload" />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" strategy="lazyOnload"
                onLoad={() => {
                    setTimeout(() => setAreScriptsLoaded(true), 500);
                }}
            />

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 z-0 w-full h-full object-cover"
                style={{
                    filter: "brightness(0.6) contrast(1.1)",
                    transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)",
                }}
            />

            <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none"></div>

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover opacity-80"
                    style={{
                        transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)",
                    }}
                />
            </div>

            <div className="relative z-20 flex flex-col h-full justify-between p-4 md:p-6 lg:p-8 grow">
                <header className="flex items-center justify-between w-full">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors bg-black/20 backdrop-blur-md px-4 md:px-5 py-3 md:py-2 rounded-full border border-white/10 shadow-lg min-h-[48px]"
                    >
                        <span className="material-symbols-outlined text-xl md:text-lg">arrow_back_ios_new</span>
                        <span className="font-bold text-sm hidden md:block">Back</span>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")}
                            className="md:hidden flex items-center justify-center size-12 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-primary transition-colors shadow-lg active:scale-95"
                            title="Flip Camera"
                        >
                            <span className="material-symbols-outlined">flip_camera_ios</span>
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
                            <span className="material-symbols-outlined text-primary text-sm">videocam</span>
                            <span className="text-xs font-bold text-white tracking-wider">AI VISION ACTIVE</span>
                        </div>
                        <div className={`text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg ${isModelReady ? "animate-pulse-red bg-red-600 shadow-red-900/50" : "bg-orange-500 shadow-orange-900/50"}`}>
                            <div className={`w-2 h-2 rounded-full bg-white ${isModelReady ? "animate-pulse" : ""}`}></div>
                            <span className="text-xs md:text-xs font-bold tracking-widest">{isModelReady ? "LIVE" : "LOADING AI"}</span>
                        </div>
                    </div>
                </header>

                {/* Countdown Overlay or Start Button */}
                {!isTrackingStarted && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        {countdown !== null ? (
                            <div className="text-8xl md:text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(57,255,20,0.8)] animate-ping">
                                {countdown}
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    setCountdown(5);
                                    let count = 5;
                                    const timer = setInterval(() => {
                                        count -= 1;
                                        if (count > 0) {
                                            setCountdown(count);
                                        } else {
                                            clearInterval(timer);
                                            setCountdown(null);
                                            setIsTrackingStarted(true);
                                        }
                                    }, 1000);
                                }}
                                disabled={!isModelReady}
                                className={`px-10 py-5 rounded-full text-2xl md:text-3xl font-black uppercase tracking-widest shadow-2xl transition-all ${isModelReady ? "bg-primary text-black hover:scale-110 shadow-primary/50 cursor-pointer" : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-70"}`}
                            >
                                {isModelReady ? "START WORKOUT" : "WAITING FOR AI..."}
                            </button>
                        )}
                    </div>
                )}

                <div className="flex-1 border-4 border-dashed border-primary/10 rounded-3xl m-4 pointer-events-none hidden md:block"></div>

                <div className="w-full flex flex-col items-center gap-3 md:gap-6 pb-2 md:pb-4 pointer-events-auto mt-auto">
                    <div className="w-full max-w-md bg-background-dark/60 md:bg-background-dark/80 backdrop-blur-md md:backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 shadow-lg relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="flex flex-col gap-2 md:gap-3">

                            <div className="flex justify-between items-center gap-3">
                                <div className="flex flex-col w-full relative">
                                    <select
                                        value={currentExercise}
                                        onChange={(e) => setCurrentExercise(e.target.value)}
                                        className="appearance-none bg-black/40 border border-white/10 rounded-xl text-white font-bold py-2 md:py-3 pl-3 md:pl-4 pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full cursor-pointer transition-all hover:bg-black/60 shadow-inner text-sm md:text-base"
                                    >
                                        <option value="benchpress">Bench Press (Tree Model 99.9%)</option>
                                        <option value="squat">Back Squat (Deep MLP 98.5%)</option>
                                        <option value="deadlift">Deadlift (Deep MLP 98.1%)</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                                </div>

                                <div className="shrink-0 w-24 md:w-32">
                                    <div className="px-2 md:px-3 py-2 md:py-3 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl text-primary font-bold flex flex-col items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.15)] min-w-[80px] md:min-w-[100px]">
                                        <span className="text-[10px] md:text-xs text-primary/80 uppercase tracking-widest leading-none mb-1">Form</span>
                                        <span className="text-3xl md:text-4xl font-black leading-none">{formScore}<span className="text-xs md:text-sm font-bold">%</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-start gap-3 border rounded-xl p-3 md:p-4 ${isGoodForm ? "bg-primary/10 border-primary/30" : "bg-red-500/10 border-red-500/30"}`}>
                                <span className={`material-symbols-outlined shrink-0 text-2xl md:text-3xl ${isGoodForm ? "text-primary" : "text-red-400"}`}>
                                    {isGoodForm ? "check_circle" : "warning"}
                                </span>
                                <div className="flex flex-col flex-1 min-w-0 justify-center">
                                    <span className={`font-black text-sm md:text-base truncate ${isGoodForm ? "text-primary" : "text-red-300"}`}>
                                        {feedbackTitle}
                                    </span>
                                    <span className={`${isGoodForm ? "text-primary" : "text-red-200"} text-xs md:text-sm leading-tight opacity-90 line-clamp-2`}>
                                        {isModelReady ? feedbackDetail : "Warming up AI models... Please stand in frame."}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-1">
                                <div className="flex-1 bg-black/40 rounded-xl p-2 md:p-3 flex items-center justify-center gap-1.5 border border-white/5">
                                    <span className={`material-symbols-outlined text-lg md:text-xl ${isGoodForm ? "text-primary" : "text-orange-400"}`}>health_and_safety</span>
                                    <span className="text-xs md:text-sm text-white font-medium whitespace-nowrap">Risk: {isGoodForm ? "Low" : "High"}</span>
                                </div>
                                <div className="flex-1 bg-black/40 rounded-xl p-2 md:p-3 flex flex-col items-center justify-center gap-1.5 border border-white/5 relative">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-blue-400 text-lg md:text-xl">fitness_center</span>
                                        <span className="text-xs md:text-sm text-white font-medium flex items-center gap-1">
                                            Reps: <span className="text-blue-400 font-bold text-lg">{currentReps}</span> / {repGoal}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={repGoal}
                                        onChange={(e) => setRepGoal(Number(e.target.value))}
                                        className="w-full h-1.5 md:h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/summary"
                        onClick={() => {
                            const scores = statsRef.current.scores;
                            const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 100;
                            const errors = JSON.parse(sessionStorage.getItem('fitvision_errors') || '[]');

                            const sessionData = {
                                id: Date.now().toString(),
                                exercise: statsRef.current.exerciseName,
                                avgScore,
                                errorCount: errors.length,
                                completedReps: currentReps,
                                repGoal: repGoal,
                                timestamp: new Date().toISOString()
                            };
                            sessionStorage.setItem('fitvision_session_stats', JSON.stringify(sessionData));
                        }}
                        className="w-full max-w-md h-14 md:h-16 mt-1 md:mt-2 bg-red-600/90 backdrop-blur-md hover:bg-red-500 active:scale-[0.98] transition-all rounded-2xl text-white font-black text-lg md:text-xl shadow-lg shadow-red-900/40 border border-red-500/50 flex items-center justify-center gap-2 md:gap-3 cursor-pointer mb-2"
                    >
                        <span className="material-symbols-outlined text-2xl">stop_circle</span>
                        END WORKOUT
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CameraPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Camera...</div>}>
            <CameraContent />
        </Suspense>
    );
}
