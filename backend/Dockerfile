FROM python:3.9-slim
WORKDIR /app

# Install library system untuk OpenCV
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hugging Face pakai port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]