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

    const [currentExercise, setCurrentExercise] = useState(model);
    const [repGoal, setRepGoal] = useState(12);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

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
                    // Run inference every 6 frames to keep real-time UI smooth
                    if (frameCount % 6 === 0 && !isPredicting) {
                        isPredicting = true;
                        try {
                            const lm = results.poseLandmarks;
                            const l_shoulder = lm[11], r_shoulder = lm[12];
                            const l_elbow = lm[13], r_elbow = lm[14];
                            const l_wrist = lm[15], r_wrist = lm[16];
                            const l_hip = lm[23], r_hip = lm[24];
                            const l_knee = lm[25], r_knee = lm[26];
                            const l_ankle = lm[27], r_ankle = lm[28];

                            const features = [
                                calculateAngle(l_shoulder, l_elbow, l_wrist),
                                calculateAngle(r_shoulder, r_elbow, r_wrist),
                                calculateAngle(l_hip, l_shoulder, l_elbow),
                                calculateAngle(r_hip, r_shoulder, r_elbow),
                                calculateAngle(l_shoulder, l_hip, l_knee),
                                calculateAngle(r_shoulder, r_hip, r_knee),
                                calculateAngle(l_hip, l_knee, l_ankle),
                                calculateAngle(r_hip, r_knee, r_ankle),
                                Math.abs(l_shoulder.x - r_shoulder.x),
                                Math.abs(l_hip.x - r_hip.x),
                                Math.abs((l_shoulder.y + r_shoulder.y) / 2 - (l_hip.y + r_hip.y) / 2),
                                Math.abs(l_elbow.y - r_elbow.y) < 0.05 ? 1 : 0,
                                Math.abs(l_knee.y - r_knee.y) < 0.05 ? 1 : 0
                            ];

                            const exercise = exerciseRef.current;
                            const res = await fetch(`http://localhost:8000/predict/${exercise}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ features })
                            });

                            if (res.ok) {
                                const data = await res.json();
                                setIsGoodForm(data.form_correct);
                                setFeedbackDetail(data.feedback);
                                setFeedbackTitle(data.form_correct ? (data.error_type === "Correct" ? "Good Form! 💪" : "Good Form") : "Correction Needed");
                                const currentScore = Math.round(data.confidence * 100);
                                setFormScore(currentScore);
                                statsRef.current.scores.push(currentScore);

                                // Auto-Capture Error Replay
                                if (!data.form_correct) {
                                    const now = Date.now();
                                    // 6 seconds cooldown between captures to avoid spam
                                    if (now - lastErrorTimeRef.current > 6000 && chunksRef.current.length > 0) {
                                        lastErrorTimeRef.current = now;

                                        // Save current 3-4 second chunk window
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
                                        console.log("Captured mistake replay!", errorRecord);
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("AI Predict Error", e);
                        } finally {
                            isPredicting = false;
                        }
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
                        className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors bg-black/20 backdrop-blur-md px-3 md:px-4 py-2 rounded-full border border-white/10 shadow-lg"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                        <span className="font-medium hidden md:block">Back</span>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")}
                            className="md:hidden flex items-center justify-center size-10 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-primary transition-colors shadow-lg active:scale-95"
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

                                <div className="shrink-0">
                                    <div className="px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl text-primary font-bold flex flex-col items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.15)] min-w-[60px] md:min-w-[80px]">
                                        <span className="text-[9px] md:text-[10px] text-primary/80 uppercase tracking-widest leading-none mb-0.5">Form</span>
                                        <span className="text-lg md:text-xl leading-none">{formScore}<span className="text-[10px] md:text-xs">%</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-start gap-2 border rounded-xl p-2 md:p-3 ${isGoodForm ? "bg-primary/10 border-primary/30" : "bg-red-500/10 border-red-500/30"}`}>
                                <span className={`material-symbols-outlined shrink-0 text-lg md:text-xl ${isGoodForm ? "text-primary" : "text-red-400"}`}>
                                    {isGoodForm ? "check_circle" : "warning"}
                                </span>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className={`font-bold text-xs md:text-sm truncate ${isGoodForm ? "text-primary" : "text-red-300"}`}>
                                        {feedbackTitle}
                                    </span>
                                    <span className={`${isGoodForm ? "text-primary" : "text-red-200"} text-[11px] md:text-sm leading-tight opacity-90 line-clamp-2`}>
                                        {isModelReady ? feedbackDetail : "Warming up AI models... Please stand in frame."}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-1">
                                <div className="flex-1 bg-black/40 rounded-lg p-1.5 md:p-2 flex items-center justify-center gap-1.5 border border-white/5">
                                    <span className={`material-symbols-outlined text-sm md:text-base ${isGoodForm ? "text-primary" : "text-orange-400"}`}>health_and_safety</span>
                                    <span className="text-[10px] md:text-xs text-white font-medium whitespace-nowrap">Risk: {isGoodForm ? "Low" : "High"}</span>
                                </div>
                                <div className="flex-1 bg-black/40 rounded-lg p-1.5 md:p-2 flex items-center justify-center gap-1.5 border border-white/5 relative">
                                    <span className="material-symbols-outlined text-blue-400 text-sm md:text-base">fitness_center</span>
                                    <span className="text-[10px] md:text-xs text-white font-medium flex items-center gap-1">
                                        Reps: <span className="text-blue-400 font-bold">0</span>/
                                        <input
                                            type="number"
                                            value={repGoal}
                                            onChange={(e) => setRepGoal(Number(e.target.value) || 1)}
                                            className="bg-transparent border-b border-white/20 w-8 text-center focus:outline-none focus:border-primary px-0 py-0 m-0"
                                        />
                                    </span>
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
                                timestamp: new Date().toISOString()
                            };
                            sessionStorage.setItem('fitvision_session_stats', JSON.stringify(sessionData));
                        }}
                        className="w-full max-w-md h-12 md:h-14 bg-red-600/90 backdrop-blur-md hover:bg-red-500 active:scale-[0.98] transition-all rounded-xl text-white font-bold text-base md:text-lg shadow-lg shadow-red-900/40 border border-red-500/50 flex items-center justify-center gap-2 md:gap-3 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">stop_circle</span>
                        End Analysis
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
