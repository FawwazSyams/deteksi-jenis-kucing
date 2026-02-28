from ultralytics import YOLO
import cv2

# Load model hasil training
model = YOLO("C:\\Users\\fawwa\\Documents\\KULIAH\\Semester 5\\Computer Vision\\UAS\\CatDetectionProject\\runs\\detect\\train3\\weights\\best.pt")

# Buka webcam (0 = kamera default laptop)
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Jalankan deteksi YOLO pada frame
    results = model(frame)

    # Render bounding box ke frame
    annotated_frame = results[0].plot()

    # Tampilkan hasil
    cv2.imshow("Realtime Cat Detection - YOLOv8", annotated_frame)

    # Tekan 'q' untuk keluar
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
