from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    balance: float
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TransactionCreate(BaseModel):
    title: str
    amount: float
    category: str
    type: str  # "credit" or "debit"

class TransactionOut(BaseModel):
    id: int
    title: str
    amount: float
    category: str
    type: str
    created_at: datetime

    class Config:
        from_attributes = True