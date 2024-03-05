import uvicorn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import tensorflow as tf

app = FastAPI()
origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)
model = tf.keras.models.load_model("./model/forge.h5", compile=False)

@app.get('/')
async def index():
    return {"hello": "world"}

def preprocess_image(image):
    img = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (128, 128))
    img = np.array(img).reshape(1, 128, 128, 1) / 255.0
    return img

@app.post("/predict-forge")
async def predict_signature(file: UploadFile = File(...)):
    contents = await file.read()
    img = preprocess_image(contents)
    prediction = model.predict(img)

    if prediction < 0.5:
        result = "Real"
    else:
        result = "Forged"

    return {"class": result, "confidence": float(prediction)*100}


if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=8000)