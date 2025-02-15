from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise HTTPException(status_code=500, detail="MONGO_URI not found in .env")

# Attempt to connect to MongoDB and print connection info
try:
    client = MongoClient(MONGO_URI)
    print("Connected to MongoDB:", client.server_info())
except Exception as e:
    print("Failed to connect to MongoDB:", e)
    raise HTTPException(status_code=500, detail="Failed to connect to MongoDB")

# Define the database and collections
db = client["BharatTelemed"]
patients_collection = db["patients"]
jwt_collection = db["patient_jwt"]

app = FastAPI()

# Set up CORS (for development; adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Patient model
class Patient(BaseModel):
    name: str
    age: int
    reason: str
    customReason: str | None = None

def generate_short_id():
    return os.urandom(4).hex()

@app.post("/patients/")
async def create_patient(patient: Patient):
    try:
        patient_data = patient.dict()
        patient_data["patient_id"] = generate_short_id()
        # Insert the patient data into MongoDB
        result = patients_collection.insert_one(patient_data)
        print("Inserted patient:", patient_data)  # Logging insertion
        return {"id": patient_data["patient_id"], "message": "Patient data inserted successfully"}
    except Exception as e:
        # Log the exception details for debugging
        print("Error inserting patient data:", e)
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient:
        patient["_id"] = str(patient["_id"])
        return patient
    else:
        raise HTTPException(status_code=404, detail="Patient not found")

@app.get("/api/get-jwt")
async def get_jwt(condition: str):
    jwt_doc = jwt_collection.find_one({"condition": condition})
    if jwt_doc and "jwt" in jwt_doc:
        return {"jwt": jwt_doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for condition")

@app.get("/")
def read_root():
    return {"message": "FastAPI server is running!"}

if __name__ == "__main__":
    import uvicorn
    # Use the PORT environment variable if available (e.g., in deployment), default to 8000 for local testing
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=True)
