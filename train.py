from ultralytics import YOLO

model = YOLO("yolov8n.pt")

model.train(
    data="dataset/CatBreeds/data.yaml",
    epochs=50,
    imgsz=640
)