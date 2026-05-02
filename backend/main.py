from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routes import auth_routes, transaction_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FinPay API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(transaction_routes.router)

@app.get("/")
def root():
    return {"message": "FinPay API is running 🚀"}