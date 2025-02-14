from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from jwt_verify_routes import router as jwt_router
from patient_routes import router as patient_router
from JIvanAI_routes import router as chat_router

app = FastAPI()

# Configure CORS (update allowed origins for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(jwt_router)
app.include_router(patient_router)
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI server is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
