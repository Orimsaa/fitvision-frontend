import cv2
import mediapipe as mp
import math

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_pose = mp.solutions.pose

# Set up the video file
VIDEO_PATH = r"C:\Users\tonkla\Downloads\VID_20260223_195246.mp4"
cap = cv2.VideoCapture(VIDEO_PATH)

# Counting Logic Variables
rep_state = "up"
rep_count = 0
frame_count = 0

def calculate_angle(a, b, c):
    radians = math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(a[1] - b[1], a[0] - b[0])
    angle = abs((radians * 180.0) / math.pi)
    if angle > 180.0:
        angle = 360.0 - angle
    return angle

print("Starting video analysis...")

with mp_pose.Pose(
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as pose:
    
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            break
        frame_count += 1
            
        # To improve performance, optionally mark the image as not writeable to
        # pass by reference.
        image.flags.writeable = False
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        # Draw the pose annotation on the image.
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        
        main_angle = 0
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            # Get coordinates for left and right arm (shoulder, elbow, wrist)
            l_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            l_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            l_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
            r_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            r_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
            r_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
            
            # Use Euclidean distance (Shoulder to Wrist) to measure arm extension regardless of camera angle
            dist_left = math.hypot(l_shoulder[0] - l_wrist[0], l_shoulder[1] - l_wrist[1])
            dist_right = math.hypot(r_shoulder[0] - r_wrist[0], r_shoulder[1] - r_wrist[1])
            
            # Max distance (most extended arm side)
            main_dist = max(dist_left, dist_right) * 1000
            
            # Rep Counting Logic (Bench Press thresholds)
            # When pushing up, distance increases. When bringing down, distance decreases.
            up_threshold = 80    # Need to calibrate this
            down_threshold = 63  # Need to calibrate this
            
            main_angle = main_dist
            
            if main_angle > up_threshold:
                if rep_state == "down":
                    rep_count += 1
                    print(f"Rep counted! Total: {rep_count} (Angle reached {int(main_angle)}, Frame: {frame_count})")
                rep_state = "up"
            elif main_angle < down_threshold:
                if rep_state == "up":
                    print(f"Bottom reached (Angle: {int(main_angle)}, Frame: {frame_count})")
                rep_state = "down"

            if frame_count % 30 == 0:
                print(f"Frame {frame_count} - Dist:{int(main_dist)} - State: {rep_state}")
            
            # Draw landmarks
            mp_drawing.draw_landmarks(
                image,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style())
        
        # Display debug info on frame
        cv2.putText(image, f"Reps: {rep_count}", (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.putText(image, f"Angle: {int(main_angle)}", (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.putText(image, f"State: {rep_state}", (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        # Show smaller window for testing
        # h, w = image.shape[:2]
        # small_image = cv2.resize(image, (int(w / 3), int(h / 3)))
        # cv2.imshow('MediaPipe Pose Test', small_image)
        # To skip showing GUI and just process video fast, we can comment out imshow and waitKey
        # if cv2.waitKey(1) & 0xFF == 27:
        #    break

cap.release()
cv2.destroyAllWindows()
print(f"Analysis complete. Total Frames: {frame_count}, Total Reps: {rep_count}")
