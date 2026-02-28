from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import base64
import cv2
import numpy as np

app = FastAPI()

# Mengizinkan Frontend (React) untuk mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Saat deploy, bintang (*) ini bisa diganti dengan URL Vercel kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model (Pastikan best.pt ada di folder backend)
model = YOLO('best.pt')

@app.get("/")
def read_root():
    return {"message": "API Deteksi Kucing Aktif!"}

@app.post("/detect")
async def detect_cat(file: UploadFile = File(...)):
    # 1. Baca gambar dari React
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # 2. Lakukan Prediksi dengan YOLOv8
    results = model(image)
    
    # 3. Ambil informasi teks (Jenis kucing & Akurasi)
    detected_cats = []
    for r in results:
        for box in r.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])
            detected_cats.append({
                "jenis": class_name, 
                "akurasi": f"{confidence * 100:.2f}%"
            })
            
    # 4. Ambil gambar hasil (dengan kotak merah) dan ubah ke format Base64 biar bisa dikirim lewat internet
    res_plotted = results[0].plot() # Format BGR array (OpenCV)
    res_plotted_rgb = cv2.cvtColor(res_plotted, cv2.COLOR_BGR2RGB) # Ubah ke RGB
    img_pil = Image.fromarray(res_plotted_rgb)
    
    buffered = io.BytesIO()
    img_pil.save(buffered, format="JPEG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return {
        "hasil_teks": detected_cats,
        "gambar_hasil": img_base64
    }