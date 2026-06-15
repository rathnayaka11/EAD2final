from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import payment

app = FastAPI(title="E-Channeling Payment Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(payment.router)

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")

@app.get("/")
def root():
    return {"message": "Payment Service Running!", "port": 8084}