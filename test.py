from ultralytics import YOLO

model = YOLO("C:\\Kuliah\\Semester 5\\Computer Vision\\CatDetectionProject\\runs\\detect\\train3\\weights\\best.pt")

model.predict(
    source="C:\\Kuliah\\Semester 5\\Computer Vision\\CatDetectionProject\\testkucing5.jpg",
    conf=0.5,
    save=True,
    name="predict",
    exist_ok=True
)
