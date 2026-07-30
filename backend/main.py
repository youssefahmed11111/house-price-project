from pathlib import Path

import joblib

import pandas as pd

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "house_price.pkl"

model = joblib.load(MODEL_PATH)

app = FastAPI(

    title="House Price Prediction API",

    version="1.0.0"

)

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

class PredictionRequest(BaseModel):

    carpet_area_sqft: float

    floor_num: float

    bathroom: float

    balcony: float

    furnishing: str

    transaction: str

    ownership: str

    facing: str

    location: str

@app.get("/health")

def health():

    return {

        "status": "ok",

        "model_loaded": True

    }

@app.post("/predict")

def predict(request: PredictionRequest):

    input_data = pd.DataFrame([{

        "carpet_area_sqft": request.carpet_area_sqft,

        "floor_num": request.floor_num,

        "bathroom": request.bathroom,

        "balcony": request.balcony,

        "furnishing": request.furnishing,

        "transaction": request.transaction,

        "ownership": request.ownership,

        "facing": request.facing,

        "location_grouped": request.location

    }])

    prediction = model.predict(input_data)[0]

    return {

        "predicted_price": float(prediction)

    }