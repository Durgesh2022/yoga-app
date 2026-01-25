from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str


# User Models
class UserCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    time_of_birth: Optional[str] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    time_of_birth: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime
    is_verified: bool = False
    wallet_balance: float = 0.0

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: str
    phone: str
    password_hash: str
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    time_of_birth: Optional[str] = None
    location: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False
    wallet_balance: float = 0.0


# Booking Models
class BookingCreate(BaseModel):
    user_id: str
    astrologer_id: str
    astrologer_name: str
    astrologer_expertise: str
    astrologer_experience: str
    astrologer_languages: str
    service_name: str
    service_duration: str
    service_price: float
    booking_date: str
    booking_time: str

class BookingResponse(BaseModel):
    id: str
    user_id: str
    astrologer_id: str
    astrologer_name: str
    astrologer_expertise: str
    astrologer_experience: str
    astrologer_languages: str
    service_name: str
    service_duration: str
    service_price: float
    booking_date: str
    booking_time: str
    status: str
    created_at: datetime

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    astrologer_id: str
    astrologer_name: str
    astrologer_expertise: str
    astrologer_experience: str
    astrologer_languages: str
    service_name: str
    service_duration: str
    service_price: float
    booking_date: str
    booking_time: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)


def hash_password(password: str) -> str:
    """Simple password hashing using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()


# Status Routes
@api_router.get("/")
async def root():
    return {"message": "Celestials Healing API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# User Authentication Routes
@api_router.post("/auth/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    """Register a new user"""
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if phone already exists
    existing_phone = await db.users.find_one({"phone": user_data.phone})
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    # Create new user
    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hash_password(user_data.password),
        gender=user_data.gender,
        date_of_birth=user_data.date_of_birth,
        time_of_birth=user_data.time_of_birth,
        location=user_data.location,
    )
    
    await db.users.insert_one(user.dict())
    
    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        gender=user.gender,
        date_of_birth=user.date_of_birth,
        time_of_birth=user.time_of_birth,
        location=user.location,
        created_at=user.created_at,
        is_verified=user.is_verified,
        wallet_balance=user.wallet_balance,
    )


@api_router.post("/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    """Login a user"""
    # Find user by email
    user = await db.users.find_one({"email": credentials.email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if user["password_hash"] != hash_password(credentials.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return UserResponse(
        id=user["id"],
        full_name=user["full_name"],
        email=user["email"],
        phone=user["phone"],
        gender=user.get("gender"),
        date_of_birth=user.get("date_of_birth"),
        time_of_birth=user.get("time_of_birth"),
        location=user.get("location"),
        created_at=user["created_at"],
        is_verified=user.get("is_verified", False),
        wallet_balance=user.get("wallet_balance", 0.0),
    )


@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID"""
    user = await db.users.find_one({"id": user_id})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user["id"],
        full_name=user["full_name"],
        email=user["email"],
        phone=user["phone"],
        gender=user.get("gender"),
        date_of_birth=user.get("date_of_birth"),
        time_of_birth=user.get("time_of_birth"),
        location=user.get("location"),
        created_at=user["created_at"],
        is_verified=user.get("is_verified", False),
        wallet_balance=user.get("wallet_balance", 0.0),
    )


# Booking Routes
@api_router.post("/bookings", response_model=BookingResponse)
async def create_booking(booking_data: BookingCreate):
    """Create a new astrology session booking"""
    booking = Booking(
        user_id=booking_data.user_id,
        astrologer_id=booking_data.astrologer_id,
        astrologer_name=booking_data.astrologer_name,
        astrologer_expertise=booking_data.astrologer_expertise,
        astrologer_experience=booking_data.astrologer_experience,
        astrologer_languages=booking_data.astrologer_languages,
        service_name=booking_data.service_name,
        service_duration=booking_data.service_duration,
        service_price=booking_data.service_price,
        booking_date=booking_data.booking_date,
        booking_time=booking_data.booking_time,
    )
    
    await db.bookings.insert_one(booking.dict())
    
    return BookingResponse(
        id=booking.id,
        user_id=booking.user_id,
        astrologer_id=booking.astrologer_id,
        astrologer_name=booking.astrologer_name,
        astrologer_expertise=booking.astrologer_expertise,
        astrologer_experience=booking.astrologer_experience,
        astrologer_languages=booking.astrologer_languages,
        service_name=booking.service_name,
        service_duration=booking.service_duration,
        service_price=booking.service_price,
        booking_date=booking.booking_date,
        booking_time=booking.booking_time,
        status=booking.status,
        created_at=booking.created_at,
    )


@api_router.get("/bookings/user/{user_id}", response_model=List[BookingResponse])
async def get_user_bookings(user_id: str):
    """Get all bookings for a user"""
    bookings = await db.bookings.find({"user_id": user_id}).to_list(100)
    return [BookingResponse(
        id=b["id"],
        user_id=b["user_id"],
        astrologer_id=b["astrologer_id"],
        astrologer_name=b["astrologer_name"],
        astrologer_expertise=b["astrologer_expertise"],
        astrologer_experience=b["astrologer_experience"],
        astrologer_languages=b["astrologer_languages"],
        service_name=b["service_name"],
        service_duration=b["service_duration"],
        service_price=b["service_price"],
        booking_date=b["booking_date"],
        booking_time=b["booking_time"],
        status=b["status"],
        created_at=b["created_at"],
    ) for b in bookings]


@api_router.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: str):
    """Get booking by ID"""
    booking = await db.bookings.find_one({"id": booking_id})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return BookingResponse(
        id=booking["id"],
        user_id=booking["user_id"],
        astrologer_id=booking["astrologer_id"],
        astrologer_name=booking["astrologer_name"],
        astrologer_expertise=booking["astrologer_expertise"],
        astrologer_experience=booking["astrologer_experience"],
        astrologer_languages=booking["astrologer_languages"],
        service_name=booking["service_name"],
        service_duration=booking["service_duration"],
        service_price=booking["service_price"],
        booking_date=booking["booking_date"],
        booking_time=booking["booking_time"],
        status=booking["status"],
        created_at=booking["created_at"],
    )


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
