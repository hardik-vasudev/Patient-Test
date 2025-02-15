import os
import logging
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv

# For the chat endpoint using Groq
from groq import Groq  # Ensure this package is installed

# Load environment variables from the .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------------------------
# MongoDB Configuration
# ----------------------------
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise HTTPException(status_code=500, detail="MONGO_URI not found in .env")

try:
    client = MongoClient(MONGO_URI)
    logger.info("Connected to MongoDB: %s", client.server_info())
except Exception as e:
    logger.error("Failed to connect to MongoDB: %s", e)
    raise HTTPException(status_code=500, detail="Failed to connect to MongoDB")

db = client["BharatTelemed"]
patients_collection = db["patients"]
jwt_collection = db["patient_jwt"]

# ----------------------------
# Groq Chat Client Configuration
# ----------------------------
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY not found in environment variables.")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# ----------------------------
# FastAPI App Setup
# ----------------------------
app = FastAPI()

# Set up CORS middleware (adjust allowed_origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL(s) in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Pydantic Models
# ----------------------------
class Patient(BaseModel):
    name: str
    age: int
    reason: str
    customReason: str | None = None  # Requires Python 3.10+; otherwise, use Optional[str]

class ChatRequest(BaseModel):
    message: str

# ----------------------------
# Helper Functions
# ----------------------------
def generate_short_id() -> str:
    return os.urandom(4).hex()

# ----------------------------
# API Endpoints
# ----------------------------

@app.get("/")
def read_root():
    return {"message": "FastAPI server is running!"}

# Patients endpoints
@app.post("/patients/")
async def create_patient(patient: Patient):
    try:
        patient_data = patient.dict()
        patient_data["patient_id"] = generate_short_id()
        patients_collection.insert_one(patient_data)
        return {"id": patient_data["patient_id"], "message": "Patient data inserted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert patient data: {e}")

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    patient = patients_collection.find_one({"patient_id": patient_id})
    if patient:
        # Convert MongoDB ObjectId to string for JSON serialization
        patient["_id"] = str(patient["_id"])
        return patient
    else:
        raise HTTPException(status_code=404, detail="Patient not found")

# JWT retrieval endpoint
@app.get("/api/get-jwt")
async def get_jwt(condition: str = Query(...)):
    """
    Fetch the JWT associated with the given condition.
    For example, if condition is 'diabetes', it returns the stored JWT for diabetes.
    """
    jwt_doc = jwt_collection.find_one({"condition": condition})
    if jwt_doc and "jwt" in jwt_doc:
        return {"jwt": jwt_doc["jwt"]}
    else:
        raise HTTPException(status_code=404, detail="JWT not found for condition")

# Chat endpoint using Groq
@app.post("/api/chat/")
async def chat(request: ChatRequest):
    if not groq_client:
        raise HTTPException(status_code=500, detail="Groq client is not configured.")
    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are JivanAI, an advanced AI health assistant. Your specialty is diagnosing common ailments based on symptoms "
                        "and providing clear, concise recovery plans. Respond in bullet points, keeping the response under 60 words. "
                        "Always include this disclaimer: 'This advice is informational only and should not replace professional medical consultation.'"
                    )
                },
                {"role": "user", "content": request.message}
            ]
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------
# Run the Application
# ----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001, reload=True)
