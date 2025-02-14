from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise HTTPException(status_code=500, detail="MONGO_URI not found")

client = MongoClient(MONGO_URI)
db = client["BharatTelemed"]
patients_collection = db["patients"]

router = APIRouter()

class Patient(BaseModel):
    name: str
    age: int
    reason: str
    customReason: str | None = None

def generate_short_id():
    return os.urandom(4).hex()

@router.post("/patients/")
async def create_patient(patient: Patient):
    try:
        patient_data = patient.dict()
        patient_data["patient_id"] = generate_short_id()
        patients_collection.insert_one(patient_data)
        return {"id": patient_data["patient_id"], "message": "Patient data inserted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")

@router.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient:
        patient["_id"] = str(patient["_id"])
        return patient
    else:
        raise HTTPException(status_code=404, detail="Patient not found")
