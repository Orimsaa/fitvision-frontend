export const en = {
    dashboard: {
        greeting: "Hello,",
        athlete: "Athlete",
        subtitle: "Ready to perfect your form today?",
        exerciseSelection: {
            benchPress: "Bench Press",
            squat: "Back Squat",
            deadlift: "Deadlift"
        },
        actionCard: {
            badge: "AI Powered",
            selected: "selected",
            title: "Start AI Form Analysis",
            description: "Analyze your workout form in real-time with our advanced computer vision technology. Get instant feedback on your posture.",
            launchCamera: "Launch Camera",
            viewTutorial: "View Tutorial"
        },
        stats: {
            formAccuracy: "Form Accuracy",
            avgScore: "avg. score",
            basedOn: "Based on last {count} sessions",
            aiTip: "AI Tip",
            seeDetails: "See details",
            recentScans: "Recent Scans",
            viewAll: "View all",
            noSessions: "No sessions yet. Click 'Launch Camera' to start.",
            flawlessSet: "Flawless Set",
            mistakesDetected: "Mistakes Detected",
            accuracy: "accuracy"
        }
    },
    nav: {
        home: "Home",
        history: "History",
        camera: "AI Camera",
        stats: "Stats",
        settings: "Settings"
    },
    history: {
        title: "Workout History",
        subtitle: "Track your form accuracy and consistency over time.",
        filters: {
            all: "All Exercises"
        },
        chart: {
            title: "Form Accuracy Trend",
            subtitle: "Last 30 Days",
            progress: "Excellent Progress"
        },
        heatmap: {
            title: "Activity Heatmap",
            viewYear: "View 2025",
            exportData: "Export Data",
            streak: "Current Streak",
            totalWorkouts: "Total Workouts",
            days: "Days"
        },
        pastSessions: {
            title: "Past Sessions",
            empty: "No recent sessions found. Go do some lifts!",
            perfectForm: "Perfect Form",
            mistakes: "Mistakes Detected",
            accuracy: "Accuracy"
        }
    },
    summary: {
        title: "Analysis Complete!",
        subtitle: "Great job! Our AI has finished processing your movement patterns.",
        formAccuracy: "Form Accuracy",
        capturedMistakes: "Captured Mistakes",
        overallRisk: "Overall Risk",
        riskLevels: {
            high: "High",
            moderate: "Moderate",
            safe: "Safe"
        },
        errorReplays: {
            title: "Error Replays (Auto-Captured)",
            reviewRecommended: "REVIEW RECOMMENDED",
            perfectSet: "PERFECT SET",
            flawlessTitle: "Flawless Technique!",
            flawlessDesc: "The AI did not detect any form breaks during your session. Keep up the great work.",
            mistakeClip: "MISTAKE CLIP",
            clipDesc: "This 3-second clip shows the exact moment your form deteriorated."
        },
        actions: {
            tryAgain: "Try Again",
            backToDashboard: "Back to Dashboard"
        }
    },
    settings: {
        title: "Settings",
        subtitle: "Synchronize your biometric data and calibrate the",
        subtitleHighlight: "FitVision AI",
        subtitleEnd: "neural core for maximum performance.",
        biometric: {
            title: "Biometric Identity",
            uploadPhoto: "Upload Photo",
            displayName: "Display Name",
            height: "Height (cm)",
            weight: "Weight (kg)"
        },
        aiPreferences: {
            title: "AI Preferences",
            voice: {
                title: "Enable Voice Feedback (Coach Mode)",
                desc: "AI will provide real-time vocal corrections during sets."
            },
            autoSave: {
                title: "Auto-save Error Replays",
                desc: "Automatically clip and save footage where form breakdown is detected."
            },
            countdown: {
                title: "3-Second Countdown",
                desc: "Delay recording to allow you to get into proper position."
            }
        },
        actions: {
            saveChanges: "Save Changes",
            cancel: "Cancel"
        }
    },
    tutorial: {
        hero: {
            tag: "System Calibration Required",
            title: "How to set up your camera for",
            titleHighlight: "AI Analysis",
            subtitle: "Proper placement ensures",
            subtitleHighlight: "high accuracy",
            subtitleEnd: "in joint tracking and real-time form correction. Follow these steps for peak performance."
        },
        steps: {
            distance: {
                title: "01. Distance",
                desc: "Place your device",
                descHighlight: "2-3 meters",
                descEnd: "away. Your entire body must be visible from head to toe in the frame."
            },
            angle: {
                title: "02. Angle",
                desc: "Position at a",
                descHighlight: "45° or 90° angle",
                descEnd: ". Avoid straight-on views to allow the AI to perceive depth and limb extension."
            },
            lighting: {
                title: "03. Lighting",
                desc: "Ensure the area is",
                descHighlight: "well-lit",
                descEnd: ". High contrast between your body and the background helps joint marker detection."
            }
        },
        capabilities: {
            title: "Supported Exercises & Capabilities",
            squat: {
                title: "Back Squat",
                desc: "Deep Multi-Layer Perceptron model with",
                descHighlight: "detailed mistake detection",
                points: [
                    "Shallow depth",
                    "Forward lean",
                    "Knees caving in",
                    "Heels off ground",
                    "Asymmetric movement"
                ]
            },
            deadlift: {
                title: "Deadlift",
                desc: "Deep Multi-Layer Perceptron model for",
                descHighlight: "overall form validation",
                points: [
                    "Checks overall biomechanics",
                    "Verifies back alignment",
                    "Validates hip hinge"
                ],
                note: "Binary Correct/Incorrect feedback"
            },
            benchpress: {
                title: "Bench Press",
                desc: "Decision Tree ensemble for",
                descHighlight: "upper body validation",
                points: [
                    "Checks elbow tuck",
                    "Back arch validation",
                    "Wrist straightness"
                ],
                note: "Binary Correct/Incorrect feedback"
            }
        },
        visualGuide: {
            title: "Visual Setup Guide",
            correct: {
                tag: "RECOMMENDED",
                title: "CORRECT: Side Profile",
                desc: "Side-angle setup allows our AI to track spine alignment and knee flexion with maximum precision.",
                point1: "Full body visible in frame",
                point2: "90 degree clearance from camera"
            },
            incorrect: {
                tag: "AVOID",
                title: "INCORRECT: Front Facing / Close",
                desc: "Front-on views obscure limb depth. Being too close cuts off crucial tracking points for movement analysis.",
                point1: "Joints obscured by perspective",
                point2: "Legs or head cut off from frame"
            }
        },
        cta: {
            button: "I UNDERSTAND, LAUNCH CAMERA",
            privacy: "Your video stream is processed locally and never stored."
        }
    }
};
