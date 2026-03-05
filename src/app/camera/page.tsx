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
    const isTrackingStartedRef = useRef(false);

    const [countdown, setCountdown] = useState<number | null>(null);
    const [currentReps, setCurrentReps] = useState(0);

    const exerciseName = currentExercise === "squat" ? "Back Squat" : currentExercise === "deadlift" ? "Deadlift" : "Bench Press";

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isModelReady, setIsModelReady] = useState(false);
    const [areScriptsLoaded, setAreScriptsLoaded] = useState(false);
    const [isBackendReady, setIsBackendReady] = useState(false);
    const [backendStatus, setBackendStatus] = useState<"checking" | "waking" | "ready">("checking");

    // Auto-Capture Replay State
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const lastErrorTimeRef = useRef<number>(0);

    // Score smoothing: rolling window of last N predictions
    const recentPredictions = useRef<{ correct: boolean, confidence: number }[]>([]);

    // Dynamic AI State
    const [isGoodForm, setIsGoodForm] = useState(true);
    const isGoodFormRef = useRef(true); // Needed to access latest state inside MediaPipe onResults callback
    const [feedbackTitle, setFeedbackTitle] = useState("AI Ready");
    const [feedbackDetail, setFeedbackDetail] = useState("Start exercising to get feedback.");
    const [formScore, setFormScore] = useState(100);

    // Stats tracking
    const statsRef = useRef({ scores: [] as number[], exerciseName: exerciseName });
    useEffect(() => { statsRef.current.exerciseName = exerciseName; }, [exerciseName]);

    // Ping Render backend until it wakes up
    useEffect(() => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fitvision-ap.onrender.com";
        let attempts = 0;
        let stopped = false;

        const ping = async () => {
            if (stopped) return;
            try {
                attempts++;
                if (attempts > 1) setBackendStatus("waking");
                const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(8000) });
                if (res.ok) {
                    setIsBackendReady(true);
                    setBackendStatus("ready");
                    return; // done!
                }
            } catch {
                // still waking — ignore error and retry
            }
            if (!stopped) setTimeout(ping, 3000);
        };

        ping();
        return () => { stopped = true; };
    }, []);

    // Developer Test Mode refs
    const cameraWrapperRef = useRef<any>(null);
    const poseWrapperRef = useRef<any>(null);
    const isMockVideoPlaying = useRef<boolean>(false);

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !videoRef.current || !poseWrapperRef.current) return;

        // Stop the webcam camera wrapper
        if (cameraWrapperRef.current) {
            cameraWrapperRef.current.stop();
        }

        const videoUrl = URL.createObjectURL(file);
        const videoElement = videoRef.current;
        videoElement.srcObject = null;
        videoElement.src = videoUrl;
        videoElement.loop = true;
        videoElement.muted = true;

        isMockVideoPlaying.current = true;
        setIsTrackingStarted(true);
        isTrackingStartedRef.current = true;
        setFeedbackDetail("Processing Simulation...");

        videoElement.play();

        const processFrame = async () => {
            if (!isMockVideoPlaying.current || !videoElement || videoElement.paused || videoElement.ended) return;
            try {
                if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                    await poseWrapperRef.current.send({ image: videoElement });
                }
            } catch (err) {
                console.error("Mock Video Processing Error", err);
            }
            if ((videoElement as any).requestVideoFrameCallback) {
                (videoElement as any).requestVideoFrameCallback(processFrame);
            } else {
                requestAnimationFrame(processFrame);
            }
        };

        videoElement.onplay = () => {
            if ((videoElement as any).requestVideoFrameCallback) {
                (videoElement as any).requestVideoFrameCallback(processFrame);
            } else {
                requestAnimationFrame(processFrame);
            }
        };
    };

    const exerciseRef = useRef(currentExercise);
    useEffect(() => {
        exerciseRef.current = currentExercise;
        // Reset feedback when exercise changes
        setIsGoodForm(true);
        isGoodFormRef.current = true;
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

            const pose = new Pose({
                locateFile: (file: string) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                },
            });
            poseWrapperRef.current = pose;

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

                    // Clear previous session errors on first frame
                    if (!sessionStorage.getItem('fitvision_errors_cleared')) {
                        sessionStorage.removeItem('fitvision_errors');
                        sessionStorage.setItem('fitvision_errors_cleared', 'true');
                    }
                }

                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                if (results.image) {
                    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
                } else if (videoElement && videoElement.videoWidth > 0) {
                    // Fallback: draw the video element directly (essential for mock video uploads)
                    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                }

                if (results.poseLandmarks) {
                    // Dynamic styling based on real-time form status
                    const isGood = isGoodFormRef.current;
                    const primaryColor = isGood ? "#38ff14" : "#ff1e1e"; // Neon Green vs Neon Red

                    canvasCtx.save();
                    // Glow Effect
                    canvasCtx.shadowBlur = 15;
                    canvasCtx.shadowColor = primaryColor;

                    // Draw glowing skeleton lines
                    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: primaryColor, lineWidth: 6 });

                    // Remove glow for the joints (to keep them sharp)
                    canvasCtx.shadowBlur = 0;
                    drawLandmarks(canvasCtx, results.poseLandmarks, { color: "#ffffff", fillColor: primaryColor, lineWidth: 2, radius: 4 });

                    canvasCtx.restore();

                    frameCount++;
                    // Run inference every 6 frames to keep real-time UI smooth AND only if tracking has started
                    if (frameCount % 6 === 0 && !isPredicting && isTrackingStartedRef.current) {
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

                        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fitvision-ap.onrender.com";

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
                                    console.log('[FV] API Response:', { form_correct: data.form_correct, confidence: data.confidence?.toFixed(3) });

                                    // Push prediction into rolling window (keep last 5)
                                    recentPredictions.current.push({ correct: data.form_correct, confidence: data.confidence });
                                    if (recentPredictions.current.length > 5) recentPredictions.current.shift();

                                    // Determine overall form status using MAJORITY VOTE of recent predictions
                                    const window = recentPredictions.current;
                                    const incorrectCount = window.filter(p => !p.correct).length;
                                    const isFormCorrect = incorrectCount < Math.ceil(window.length / 2); // majority must be incorrect to flag it

                                    setIsGoodForm(isFormCorrect);
                                    isGoodFormRef.current = isFormCorrect;
                                    setFeedbackDetail(data.feedback);
                                    setFeedbackTitle(isFormCorrect ? "Good Form! 💪" : "Correction Needed");

                                    // Calculate smoothed score from the rolling window
                                    let rawScore: number;
                                    if (isFormCorrect) {
                                        // Average confidence of correct predictions
                                        const correctPreds = window.filter(p => p.correct);
                                        const avgConf = correctPreds.length > 0 ? correctPreds.reduce((s, p) => s + p.confidence, 0) / correctPreds.length : 0.8;
                                        rawScore = avgConf * 100;
                                        if (rawScore > 98) rawScore = 95 + Math.random() * 4;
                                        if (rawScore < 70) rawScore = 70 + Math.random() * 10;
                                    } else {
                                        // Average confidence of incorrect predictions → invert
                                        const badPreds = window.filter(p => !p.correct);
                                        const avgConf = badPreds.length > 0 ? badPreds.reduce((s, p) => s + p.confidence, 0) / badPreds.length : 0.5;
                                        rawScore = (1 - avgConf) * 100;
                                        rawScore = Math.max(15, Math.min(55, rawScore));
                                        rawScore += (Math.random() * 6 - 3);
                                    }
                                    const currentScore = Math.round(Math.max(0, Math.min(100, rawScore)));
                                    console.log('[FV] Score Update:', { isFormCorrect, incorrectCount, windowSize: window.length, currentScore });

                                    setFormScore(currentScore);
                                    statsRef.current.scores.push(currentScore);

                                    // Auto-Capture Error Replay (On-Demand 3-second recording)
                                    if (!isFormCorrect) { // use the smoothed isFormCorrect instead of data.form_correct
                                        const now = Date.now();
                                        // Wait at least 6 seconds between captures to avoid spam
                                        if (now - lastErrorTimeRef.current > 6000) {
                                            lastErrorTimeRef.current = now;

                                            try {
                                                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                                                    mediaRecorderRef.current.stop();
                                                }
                                                const stream = (canvasElement as any).captureStream(30);
                                                const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                                                const chunks: Blob[] = [];

                                                recorder.ondataavailable = (e) => {
                                                    if (e.data.size > 0) chunks.push(e.data);
                                                };

                                                recorder.onstop = () => {
                                                    if (chunks.length === 0) return;
                                                    const blob = new Blob(chunks, { type: 'video/webm' });
                                                    const url = URL.createObjectURL(blob);
                                                    const errorRecord = {
                                                        url,
                                                        title: data.error_type || "Correction Needed",
                                                        detail: data.feedback,
                                                        time: new Date().toLocaleTimeString()
                                                    };
                                                    const prevErrors = JSON.parse(sessionStorage.getItem('fitvision_errors') || '[]');
                                                    sessionStorage.setItem('fitvision_errors', JSON.stringify([...prevErrors, errorRecord]));
                                                };

                                                recorder.start();
                                                mediaRecorderRef.current = recorder;

                                                // Stop recording after 3 seconds
                                                setTimeout(() => {
                                                    if (recorder.state !== 'inactive') {
                                                        recorder.stop();
                                                    }
                                                }, 3000);
                                            } catch (err) {
                                                console.warn("Failed to start on-demand MediaRecorder", err);
                                            }
                                        }
                                    }
                                } else {
                                    const errText = await res.text();
                                    console.error(`API Error ${res.status}:`, errText);
                                    setFeedbackDetail(`Backend Error: ${res.status}`);
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
                        try {
                            if (!isMockVideoPlaying.current) {
                                await poseWrapperRef.current?.send({ image: videoElement });
                            }
                        } catch (e) {
                            console.error("Mediapipe Error onFrame", e);
                        }
                    }
                },
                width: 640,
                height: 480,
                facingMode: facingMode
            });
            cameraWrapperRef.current = camera;
            camera.start();
        };

        initMediaPipe();

        return () => {
            isUnmounted = true;
            if (cameraWrapperRef.current) {
                cameraWrapperRef.current.stop();
            }
            if (poseWrapperRef.current) {
                poseWrapperRef.current.close();
            }
            isMockVideoPlaying.current = false;
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        };
    }, [areScriptsLoaded, facingMode]);

    const endWorkoutData = () => {
        const scores = statsRef.current.scores;
        const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 100;
        const errors = JSON.parse(sessionStorage.getItem('fitvision_errors') || '[]');

        const sessionPayload = {
            id: Date.now().toString(),
            exercise: statsRef.current.exerciseName,
            avgScore,
            errorCount: errors.length,
            completedReps: currentReps,
            repGoal,
            timestamp: new Date().toISOString(),
            errors: errors
        };

        // Save for immediate summary view
        sessionStorage.setItem('fitvision_session_stats', JSON.stringify(sessionPayload));

        // Save to persistent history
        const history = JSON.parse(localStorage.getItem('fitvision_history') || '[]');
        history.unshift(sessionPayload); // Add new session to top of list
        // Keep only last 50 sessions to prevent localStorage quota issues especially with Blob URLs
        if (history.length > 50) history.pop();
        localStorage.setItem('fitvision_history', JSON.stringify(history));
    };

    return (
        <div className="bg-black font-display text-white h-screen flex flex-col overflow-hidden">
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="lazyOnload" />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" strategy="lazyOnload" />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" strategy="lazyOnload"
                onLoad={() => { setTimeout(() => setAreScriptsLoaded(true), 500); }}
            />

            <div className="flex flex-col lg:flex-row flex-1 h-full overflow-hidden">
                {/* ── Camera View ── */}
                <div className="relative flex-1 flex flex-col min-h-0">
                    <video ref={videoRef} autoPlay playsInline muted
                        className="absolute inset-0 z-0 w-full h-full object-cover"
                        style={{ filter: "brightness(0.6) contrast(1.1)", transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)" }}
                    />
                    <canvas ref={canvasRef}
                        className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none"
                        style={{ transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)" }}
                    />

                    {/* Top Bar */}
                    <header className="relative z-30 flex items-center justify-between p-3 md:p-4">
                        <Link href="/" className="flex items-center gap-1.5 text-white/80 hover:text-white bg-black/30 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                            <span className="text-sm font-semibold hidden sm:block">Back</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setFacingMode(p => p === "user" ? "environment" : "user")}
                                className="lg:hidden flex items-center justify-center w-10 h-10 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white/80 active:scale-95 transition-all">
                                <span className="material-symbols-outlined text-lg">flip_camera_ios</span>
                            </button>
                            {isTrackingStarted && (
                                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-white/80 tracking-wider">
                                    <span className="material-symbols-outlined text-primary text-sm">smart_toy</span>AI ACTIVE
                                </div>
                            )}
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider ${isModelReady ? "bg-red-600/80 text-white" : "bg-orange-500/80 text-white"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full bg-white ${isModelReady ? "animate-pulse" : ""}`}></div>
                                {isModelReady ? "LIVE" : "LOADING"}
                            </div>
                        </div>
                    </header>

                    {/* ── Setup Drawer (floats over live camera) ── */}
                    {!isTrackingStarted && (
                        <div className="absolute inset-0 z-40 flex flex-col justify-end pointer-events-none">
                            {/* Countdown */}
                            {countdown !== null && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-8xl md:text-9xl font-black text-primary drop-shadow-[0_0_40px_rgba(57,255,20,0.6)] animate-pulse">{countdown}</div>
                                </div>
                            )}

                            {/* Floating bottom card */}
                            {countdown === null && (
                                <div className="pointer-events-auto mx-3 mb-4 md:mx-auto md:w-full md:max-w-md">
                                    <div className="bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-5 flex flex-col gap-4">
                                        {/* Header row */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-white font-black text-lg leading-none">FitVision</h2>
                                                <p className="text-white/40 text-xs mt-0.5">Choose exercise & start</p>
                                            </div>
                                            {/* Server + MediaPipe status pills */}
                                            <div className="flex items-center gap-1.5">
                                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${isModelReady ? "border-primary/30 bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-slate-500"}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isModelReady ? "bg-primary" : "bg-slate-500 animate-pulse"}`}></span>
                                                    Pose
                                                </div>
                                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${isBackendReady ? "border-primary/30 bg-primary/10 text-primary" : "border-orange-400/30 bg-orange-400/5 text-orange-400"}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isBackendReady ? "bg-primary" : "bg-orange-400 animate-pulse"}`}></span>
                                                    {backendStatus === "ready" ? "Server" : backendStatus === "waking" ? "Waking..." : "Server"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Exercise + rep goal row */}
                                        <div className="flex gap-3">
                                            <div className="flex-1 relative">
                                                <select value={currentExercise} onChange={(e) => setCurrentExercise(e.target.value)}
                                                    className="appearance-none w-full bg-white/5 border border-white/10 rounded-xl text-white font-bold py-2.5 pl-3 pr-8 focus:outline-none focus:border-primary cursor-pointer text-sm">
                                                    <option value="benchpress">🏋️ Bench Press</option>
                                                    <option value="squat">🦵 Back Squat</option>
                                                    <option value="deadlift">💪 Deadlift</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-base">expand_more</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl px-4 min-w-[80px]">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => setRepGoal(r => Math.max(1, r - 1))} className="text-white/40 hover:text-white text-lg leading-none">−</button>
                                                    <span className="text-primary font-black text-lg w-6 text-center">{repGoal}</span>
                                                    <button onClick={() => setRepGoal(r => Math.min(50, r + 1))} className="text-white/40 hover:text-white text-lg leading-none">+</button>
                                                </div>
                                                <span className="text-white/30 text-[9px] uppercase tracking-wider">Reps</span>
                                            </div>
                                        </div>

                                        {/* Start button */}
                                        <button onClick={() => {
                                            setCountdown(3); let count = 3;
                                            const timer = setInterval(() => { count -= 1; if (count > 0) setCountdown(count); else { clearInterval(timer); setCountdown(null); setIsTrackingStarted(true); isTrackingStartedRef.current = true; } }, 1000);
                                        }} disabled={!isModelReady || !isBackendReady}
                                            className={`w-full py-3.5 rounded-2xl text-base font-black uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 ${isModelReady && isBackendReady ? "bg-primary text-black hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_0_20px_rgba(57,255,20,0.3)]" : "bg-gray-700/80 text-gray-400 cursor-not-allowed"}`}>
                                            <span className="material-symbols-outlined text-xl">{isModelReady && isBackendReady ? "play_arrow" : "hourglass_top"}</span>
                                            {isModelReady && isBackendReady ? "Start Analysis" : !isModelReady ? "Loading Pose AI..." : backendStatus === "waking" ? "Waking up server..." : "Connecting to server..."}
                                        </button>

                                        {/* Upload fallback */}
                                        <label className={`w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer ${isModelReady ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10" : "bg-gray-800/50 border-gray-700/50 text-gray-600 pointer-events-none"}`}>
                                            <span className="material-symbols-outlined text-base text-blue-400">upload_file</span>Upload Video
                                            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={!isModelReady} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    {/* ── Mobile Bottom HUD ── */}
                    {isTrackingStarted && (
                        <div className="lg:hidden relative z-20 mt-auto p-3 pb-4">
                            <div className="bg-black/75 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className={`shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${isGoodForm ? "bg-primary/15 border border-primary/30" : "bg-red-500/15 border border-red-500/30"}`}>
                                        <span className={`text-2xl font-black leading-none ${isGoodForm ? "text-primary" : "text-red-400"}`}>{formScore}<span className="text-[10px]">%</span></span>
                                        <span className={`text-[8px] uppercase tracking-wider font-bold ${isGoodForm ? "text-primary/70" : "text-red-400/70"}`}>Form</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className={`material-symbols-outlined text-base ${isGoodForm ? "text-primary" : "text-red-400"}`}>{isGoodForm ? "check_circle" : "warning"}</span>
                                            <span className={`font-bold text-sm truncate ${isGoodForm ? "text-primary" : "text-red-300"}`}>{feedbackTitle}</span>
                                        </div>
                                        <p className={`text-xs leading-tight line-clamp-2 ${isGoodForm ? "text-white/60" : "text-red-200/80"}`}>{feedbackDetail}</p>
                                    </div>
                                    <div className="shrink-0 text-center">
                                        <span className="text-blue-400 font-black text-2xl leading-none">{currentReps}</span>
                                        <span className="text-white/40 text-xs font-medium">/{repGoal}</span>
                                        <div className="text-[8px] text-white/40 uppercase tracking-wider font-bold">Reps</div>
                                    </div>
                                </div>
                                <Link href="/summary" onClick={endWorkoutData}
                                    className="mt-3 w-full h-12 bg-red-600/90 hover:bg-red-500 active:scale-[0.98] transition-all rounded-xl text-white font-bold text-sm shadow-lg border border-red-500/40 flex items-center justify-center gap-2 cursor-pointer">
                                    <span className="material-symbols-outlined text-lg">stop_circle</span>END WORKOUT
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Desktop Side Panel ── */}
                {isTrackingStarted && (
                    <aside className="hidden lg:flex flex-col w-80 xl:w-96 bg-[#0a0a0a] border-l border-white/5 p-5 xl:p-6 gap-5 overflow-y-auto">
                        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5">
                            <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">{exerciseName}</h3>
                                <p className="text-white/40 text-xs">AI-Powered Form Analysis</p>
                            </div>
                        </div>

                        <div className={`rounded-2xl p-5 border text-center ${isGoodForm ? "bg-primary/10 border-primary/20" : "bg-red-500/10 border-red-500/20"}`}>
                            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isGoodForm ? "text-primary/60" : "text-red-400/60"}`}>Form Score</span>
                            <div className={`text-6xl font-black leading-none mt-1 ${isGoodForm ? "text-primary" : "text-red-400"}`}>{formScore}<span className="text-xl">%</span></div>
                        </div>

                        <div className={`flex items-start gap-3 rounded-2xl p-4 border ${isGoodForm ? "bg-primary/5 border-primary/20" : "bg-red-500/5 border-red-500/20"}`}>
                            <span className={`material-symbols-outlined text-2xl shrink-0 mt-0.5 ${isGoodForm ? "text-primary" : "text-red-400"}`}>{isGoodForm ? "check_circle" : "warning"}</span>
                            <div className="min-w-0">
                                <p className={`font-bold text-sm ${isGoodForm ? "text-primary" : "text-red-300"}`}>{feedbackTitle}</p>
                                <p className={`text-xs mt-1 leading-relaxed ${isGoodForm ? "text-white/50" : "text-red-200/70"}`}>{feedbackDetail}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                                <span className={`material-symbols-outlined text-xl ${isGoodForm ? "text-primary" : "text-orange-400"}`}>health_and_safety</span>
                                <p className="text-white font-bold text-sm mt-1">{isGoodForm ? "Low Risk" : "High Risk"}</p>
                                <p className="text-white/30 text-[10px] uppercase tracking-wider mt-0.5">Injury Risk</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center">
                                <span className="material-symbols-outlined text-xl text-blue-400">repeat</span>
                                <p className="text-white font-bold text-sm mt-1"><span className="text-blue-400 text-xl font-black">{currentReps}</span> / {repGoal}</p>
                                <p className="text-white/30 text-[10px] uppercase tracking-wider mt-0.5">Repetitions</p>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Link href="/summary" onClick={endWorkoutData}
                                className="w-full h-14 bg-red-600/90 hover:bg-red-500 active:scale-[0.98] transition-all rounded-2xl text-white font-black text-base shadow-lg border border-red-500/40 flex items-center justify-center gap-3 cursor-pointer">
                                <span className="material-symbols-outlined text-2xl">stop_circle</span>END WORKOUT
                            </Link>
                        </div>
                    </aside>
                )}
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

