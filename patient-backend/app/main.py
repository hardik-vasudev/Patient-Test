import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from a .env file (for local development)
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define configuration using Pydantic BaseSettings from pydantic-settings
class Settings(BaseSettings):
    MONGO_URI: str
    ALLOWED_ORIGINS: str = "*"  # Comma-separated list of allowed origins, or "*" to allow all
    PORT: int = 8000           # Default port for local testing

    class Config:
        env_file = ".env"  # Automatically load variables from a .env file

# Initialize settings
settings = Settings()

# Validate required configuration
if not settings.MONGO_URI:
    raise RuntimeError("MONGO_URI not found in environment variables.")

# Attempt to connect to MongoDB using the provided URI
try:
    client = MongoClient(settings.MONGO_URI)
    server_info = client.server_info()  # Force connection attempt
    logger.info("Connected to MongoDB: %s", server_info)
except Exception as e:
    logger.error("Failed to connect to MongoDB: %s", e)
    raise RuntimeError("Failed to connect to MongoDB") from e

# Define the database and collections
db = client["BharatTelemed"]
patients_collection = db["patients"]
jwt_collection = db["patient_jwt"]

# Create the FastAPI app instance
app = FastAPI()

# Convert ALLOWED_ORIGINS to a list
if settings.ALLOWED_ORIGINS.strip() == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in settings.ALLOWED_ORIGINS.split(",")]

# Set up CORS middleware (adjust allowed_origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Patient model using Pydantic BaseModel
class Patient(BaseModel):
    name: str
    age: int
    reason: str
    customReason: str | None = None  # Requires Python 3.10+; use Optional[str] if needed

# Helper function to generate a short, random patient ID
def generate_short_id() -> str:
    return os.urandom(4).hex()

# Route to create a new patient record
@app.post("/patients/")
async def create_patient(patient: Patient):
    try:
        patient_data = patient.dict()
        patient_data["patient_id"] = generate_short_id()
        # Insert the patient data into MongoDB
        patients_collection.insert_one(patient_data)
        logger.info("Inserted patient: %s", patient_data)
        return {"id": patient_data["patient_id"], "message": "Patient data inserted successfully"}
    except Exception as e:
        logger.error("Error inserting patient data: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")

# Route to retrieve a patient by their ID
@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient:
        # Convert MongoDB ObjectId to string for JSON serialization
        patient["_id"] = str(patient["_id"])
        return patient
    else:
        raise HTTPException(status_code=404, detail="Patient not found")

# Route to retrieve a JWT based on a condition
@app.get("/api/get-jwt")
async def get_jwt(condition: str):
    jwt_doc = jwt_collection.find_one({"condition": condition})
    if jwt_doc and "jwt" in jwt_doc:
        return {"jwt": jwt_doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for condition")

# Root route to confirm that the server is running
@app.get("/")
def read_root():
    return {"message": "FastAPI server is running!"}

# Run the application with uvicorn when executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT, reload=True)
