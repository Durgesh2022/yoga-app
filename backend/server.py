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
import razorpay
import hmac


def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        doc = dict(doc)  # Make a copy
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
        return doc
    return doc

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_key_id = os.environ.get('RAZORPAY_KEY_ID', '')
razorpay_key_secret = os.environ.get('RAZORPAY_KEY_SECRET', '')
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

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


# Admin/Astrologer Authentication Models
class AdminCreate(BaseModel):
    fullName: str
    email: str
    password: str
    role: str = "admin"  # "admin" or "astrologer"

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminResponse(BaseModel):
    id: str
    fullName: str
    email: str
    role: str
    created_at: datetime

class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    fullName: str
    email: str
    password_hash: str
    role: str = "admin"  # "admin" or "astrologer"
    created_at: datetime = Field(default_factory=datetime.utcnow)


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


# Yoga Class Booking Models
class YogaClassBookingCreate(BaseModel):
    user_id: str
    class_name: str
    class_time: str
    class_date: str
    guru_name: str
    price: float
    credits: int
    level: str

class YogaClassBookingResponse(BaseModel):
    id: str
    user_id: str
    booking_type: str
    class_name: str
    class_time: str
    class_date: str
    guru_name: str
    price: float
    credits: int
    level: str
    status: str
    created_at: datetime

class YogaClassBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    booking_type: str = "yoga_class"
    class_name: str
    class_time: str
    class_date: str
    guru_name: str
    price: float
    credits: int
    level: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Yoga Package Purchase Models
class YogaPackagePurchaseCreate(BaseModel):
    user_id: str
    package_name: str
    price: float
    credits: int
    validity: str
    mode: Optional[str] = "Online"
    session_type: str  # "Group class" or "Private Session"

class YogaPackagePurchaseResponse(BaseModel):
    id: str
    user_id: str
    purchase_type: str
    package_name: str
    price: float
    credits: int
    validity: str
    mode: Optional[str]
    session_type: str
    status: str
    created_at: datetime

class YogaPackagePurchase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    purchase_type: str = "yoga_package"
    package_name: str
    price: float
    credits: int
    validity: str
    mode: Optional[str] = "Online"
    session_type: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Yoga Consultation Booking Models
class YogaConsultationCreate(BaseModel):
    user_id: str
    yoga_goal: str
    intensity_preference: str
    connection_method: str
    schedule_timing: str
    context_notes: Optional[str] = None
    whatsapp_number: Optional[str] = None

class YogaConsultationResponse(BaseModel):
    id: str
    user_id: str
    booking_type: str
    yoga_goal: str
    intensity_preference: str
    connection_method: str
    schedule_timing: str
    context_notes: Optional[str]
    whatsapp_number: Optional[str]
    price: float
    status: str
    created_at: datetime

class YogaConsultation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    booking_type: str = "yoga_consultation"
    yoga_goal: str
    intensity_preference: str
    connection_method: str
    schedule_timing: str
    context_notes: Optional[str] = None
    whatsapp_number: Optional[str] = None
    price: float = 0.0  # Free consultation
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


# ============= ADMIN/ASTROLOGER AUTHENTICATION =============

@api_router.post("/auth/admin-signup")
async def admin_signup(admin_data: AdminCreate):
    """Register a new admin or astrologer"""
    # Check if email already exists
    existing_admin = await db.admins.find_one({"email": admin_data.email})
    if existing_admin:
        return {
            "success": False,
            "message": "Email already registered"
        }
    
    # Create new admin/astrologer
    admin = Admin(
        fullName=admin_data.fullName,
        email=admin_data.email,
        password_hash=hash_password(admin_data.password),
        role=admin_data.role,
    )
    
    await db.admins.insert_one(admin.dict())
    
    return {
        "success": True,
        "message": "Registration successful",
        "data": AdminResponse(
            id=admin.id,
            fullName=admin.fullName,
            email=admin.email,
            role=admin.role,
            created_at=admin.created_at,
        )
    }


@api_router.post("/auth/admin-login")
async def admin_login(credentials: AdminLogin):
    """Login for admin or astrologer"""
    # Find admin by email
    admin = await db.admins.find_one({"email": credentials.email})
    
    if not admin:
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    # Verify password
    if admin["password_hash"] != hash_password(credentials.password):
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "id": admin["id"],
            "fullName": admin["fullName"],
            "email": admin["email"],
            "role": admin["role"],
            "created_at": admin["created_at"]
        }
    }


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


# Yoga Class Booking Routes
@api_router.post("/yoga/class-booking", response_model=YogaClassBookingResponse)
async def create_yoga_class_booking(booking_data: YogaClassBookingCreate):
    """Create a new yoga class booking"""
    booking = YogaClassBooking(
        user_id=booking_data.user_id,
        class_name=booking_data.class_name,
        class_time=booking_data.class_time,
        class_date=booking_data.class_date,
        guru_name=booking_data.guru_name,
        price=booking_data.price,
        credits=booking_data.credits,
        level=booking_data.level,
    )
    
    await db.yoga_bookings.insert_one(booking.dict())
    
    return YogaClassBookingResponse(
        id=booking.id,
        user_id=booking.user_id,
        booking_type=booking.booking_type,
        class_name=booking.class_name,
        class_time=booking.class_time,
        class_date=booking.class_date,
        guru_name=booking.guru_name,
        price=booking.price,
        credits=booking.credits,
        level=booking.level,
        status=booking.status,
        created_at=booking.created_at,
    )


# Yoga Package Purchase Routes
@api_router.post("/yoga/package-purchase", response_model=YogaPackagePurchaseResponse)
async def create_yoga_package_purchase(purchase_data: YogaPackagePurchaseCreate):
    """Create a new yoga package purchase"""
    purchase = YogaPackagePurchase(
        user_id=purchase_data.user_id,
        package_name=purchase_data.package_name,
        price=purchase_data.price,
        credits=purchase_data.credits,
        validity=purchase_data.validity,
        mode=purchase_data.mode,
        session_type=purchase_data.session_type,
    )
    
    await db.yoga_purchases.insert_one(purchase.dict())
    
    return YogaPackagePurchaseResponse(
        id=purchase.id,
        user_id=purchase.user_id,
        purchase_type=purchase.purchase_type,
        package_name=purchase.package_name,
        price=purchase.price,
        credits=purchase.credits,
        validity=purchase.validity,
        mode=purchase.mode,
        session_type=purchase.session_type,
        status=purchase.status,
        created_at=purchase.created_at,
    )


# Yoga Consultation Booking Routes
@api_router.post("/yoga/consultation", response_model=YogaConsultationResponse)
async def create_yoga_consultation(consultation_data: YogaConsultationCreate):
    """Create a new yoga consultation booking"""
    consultation = YogaConsultation(
        user_id=consultation_data.user_id,
        yoga_goal=consultation_data.yoga_goal,
        intensity_preference=consultation_data.intensity_preference,
        connection_method=consultation_data.connection_method,
        schedule_timing=consultation_data.schedule_timing,
        context_notes=consultation_data.context_notes,
        whatsapp_number=consultation_data.whatsapp_number,
    )
    
    await db.yoga_consultations.insert_one(consultation.dict())
    
    return YogaConsultationResponse(
        id=consultation.id,
        user_id=consultation.user_id,
        booking_type=consultation.booking_type,
        yoga_goal=consultation.yoga_goal,
        intensity_preference=consultation.intensity_preference,
        connection_method=consultation.connection_method,
        schedule_timing=consultation.schedule_timing,
        context_notes=consultation.context_notes,
        whatsapp_number=consultation.whatsapp_number,
        price=consultation.price,
        status=consultation.status,
        created_at=consultation.created_at,
    )


# Get all yoga bookings for a user
@api_router.get("/yoga/user/{user_id}/bookings")
async def get_user_yoga_bookings(user_id: str):
    """Get all yoga-related bookings for a user"""
    class_bookings = await db.yoga_bookings.find({"user_id": user_id}).to_list(100)
    package_purchases = await db.yoga_purchases.find({"user_id": user_id}).to_list(100)
    consultations = await db.yoga_consultations.find({"user_id": user_id}).to_list(100)
    
    return {
        "class_bookings": class_bookings,
        "package_purchases": package_purchases,
        "consultations": consultations,
    }


# ============= RAZORPAY PAYMENT INTEGRATION =============

# Payment Models
class CreateOrderRequest(BaseModel):
    user_id: str
    amount: float  # Amount in INR
    currency: str = "INR"
    purpose: str = "wallet_recharge"
    notes: Optional[dict] = None

class CreateOrderResponse(BaseModel):
    order_id: str
    amount: int  # Amount in paise
    currency: str
    razorpay_key_id: str

class VerifyPaymentRequest(BaseModel):
    user_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    amount: float

class WalletDeductRequest(BaseModel):
    user_id: str
    amount: float
    booking_id: str
    booking_type: str  # 'astrology', 'yoga_class', 'yoga_package'
    description: str

class TransactionRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str  # 'credit' or 'debit'
    amount: float
    balance_after: float
    description: str
    payment_id: Optional[str] = None
    order_id: Optional[str] = None
    booking_id: Optional[str] = None
    status: str = "completed"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Create Razorpay Order
@api_router.post("/payment/create-order", response_model=CreateOrderResponse)
async def create_razorpay_order(request: CreateOrderRequest):
    """Create a Razorpay order for wallet recharge"""
    try:
        # Amount in paise (Razorpay uses smallest currency unit)
        amount_in_paise = int(request.amount * 100)
        
        order_data = {
            "amount": amount_in_paise,
            "currency": request.currency,
            "receipt": f"rcpt_{uuid.uuid4().hex[:12]}",  # Max 40 chars for Razorpay
            "notes": {
                "user_id": request.user_id,
                "purpose": request.purpose,
                **(request.notes or {})
            }
        }
        
        order = razorpay_client.order.create(data=order_data)
        
        # Store order in database for verification
        await db.payment_orders.insert_one({
            "order_id": order["id"],
            "user_id": request.user_id,
            "amount": request.amount,
            "amount_paise": amount_in_paise,
            "currency": request.currency,
            "purpose": request.purpose,
            "status": "created",
            "created_at": datetime.utcnow()
        })
        
        return CreateOrderResponse(
            order_id=order["id"],
            amount=amount_in_paise,
            currency=request.currency,
            razorpay_key_id=razorpay_key_id
        )
    except Exception as e:
        logger.error(f"Error creating Razorpay order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create payment order: {str(e)}")


# Verify Payment and Add Balance
@api_router.post("/payment/verify")
async def verify_payment(request: VerifyPaymentRequest):
    """Verify Razorpay payment and add balance to wallet"""
    try:
        # 1. Prevent duplicate processing
        existing_order = await db.payment_orders.find_one({
            "order_id": request.razorpay_order_id,
            "status": "completed"
        })
        if existing_order:
            user = await db.users.find_one({"id": request.user_id})
            return {
                "success": True,
                "message": "Payment already processed",
                "new_balance": user.get("wallet_balance", 0) if user else 0
            }

        # 2. Verify signature using Razorpay SDK
        try:
            razorpay_client.utility.verify_payment_signature({
                "razorpay_order_id": request.razorpay_order_id,
                "razorpay_payment_id": request.razorpay_payment_id,
                "razorpay_signature": request.razorpay_signature
            })
        except razorpay.errors.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

        # 3. Check if user exists
        user = await db.users.find_one({"id": request.user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 4. Atomic wallet credit using $inc for thread safety
        await db.users.update_one(
            {"id": request.user_id},
            {"$inc": {"wallet_balance": request.amount}}
        )

        # 5. Get updated user to fetch new balance
        user = await db.users.find_one({"id": request.user_id})
        new_balance = user.get("wallet_balance", 0)

        # 6. Mark order as completed
        await db.payment_orders.update_one(
            {"order_id": request.razorpay_order_id},
            {"$set": {
                "status": "completed",
                "payment_id": request.razorpay_payment_id,
                "completed_at": datetime.utcnow()
            }}
        )

        # 7. Create transaction record
        transaction = TransactionRecord(
            user_id=request.user_id,
            type="credit",
            amount=request.amount,
            balance_after=new_balance,
            description="Wallet recharge via Razorpay",
            payment_id=request.razorpay_payment_id,
            order_id=request.razorpay_order_id,
        )
        await db.transactions.insert_one(transaction.dict())

        logger.info(f"Payment verified successfully for user {request.user_id}, amount: {request.amount}, new balance: {new_balance}")

        return {
            "success": True,
            "message": "Payment verified successfully",
            "new_balance": new_balance,
            "transaction_id": transaction.id
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}")
        raise HTTPException(status_code=500, detail="Payment verification failed")


# Get User Wallet Balance
@api_router.get("/wallet/{user_id}")
async def get_wallet_balance(user_id: str):
    """Get user's wallet balance"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "user_id": user_id,
        "balance": user.get("wallet_balance", 0)
    }


# Admin: Manually Add Balance (for testing or manual verification)
class ManualBalanceAdd(BaseModel):
    user_id: str
    amount: float
    reason: str = "Manual addition"

@api_router.post("/wallet/manual-add")
async def manual_add_balance(request: ManualBalanceAdd):
    """Manually add balance to user's wallet (admin endpoint)"""
    user = await db.users.find_one({"id": request.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_balance = user.get("wallet_balance", 0)
    new_balance = current_balance + request.amount
    
    await db.users.update_one(
        {"id": request.user_id},
        {"$set": {"wallet_balance": new_balance}}
    )
    
    # Create transaction record
    transaction = TransactionRecord(
        user_id=request.user_id,
        type="credit",
        amount=request.amount,
        balance_after=new_balance,
        description=request.reason,
    )
    await db.transactions.insert_one(transaction.dict())
    
    return {
        "success": True,
        "message": f"₹{request.amount} added successfully",
        "new_balance": new_balance
    }


# Deduct from Wallet (for bookings)
@api_router.post("/wallet/deduct")
async def deduct_from_wallet(request: WalletDeductRequest):
    """Deduct amount from user's wallet for bookings"""
    try:
        # Get user's current balance
        user = await db.users.find_one({"id": request.user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        current_balance = user.get("wallet_balance", 0)
        
        # Check if sufficient balance
        if current_balance < request.amount:
            return {
                "success": False,
                "message": "Insufficient balance",
                "current_balance": current_balance,
                "required_amount": request.amount,
                "shortfall": request.amount - current_balance
            }
        
        new_balance = current_balance - request.amount
        
        # Update user's wallet balance
        await db.users.update_one(
            {"id": request.user_id},
            {"$set": {"wallet_balance": new_balance}}
        )
        
        # Update booking status to 'paid'
        if request.booking_type == "astrology":
            await db.bookings.update_one(
                {"id": request.booking_id},
                {"$set": {"status": "paid", "paid_at": datetime.utcnow()}}
            )
        elif request.booking_type == "yoga_class":
            await db.yoga_bookings.update_one(
                {"id": request.booking_id},
                {"$set": {"status": "paid", "paid_at": datetime.utcnow()}}
            )
        elif request.booking_type == "yoga_package":
            await db.yoga_purchases.update_one(
                {"id": request.booking_id},
                {"$set": {"status": "paid", "paid_at": datetime.utcnow()}}
            )
        
        # Create transaction record
        transaction = TransactionRecord(
            user_id=request.user_id,
            type="debit",
            amount=request.amount,
            balance_after=new_balance,
            description=request.description,
            booking_id=request.booking_id,
        )
        await db.transactions.insert_one(transaction.dict())
        
        return {
            "success": True,
            "message": "Payment successful",
            "new_balance": new_balance,
            "transaction_id": transaction.id
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deducting from wallet: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Payment failed: {str(e)}")


# Get User Transactions
@api_router.get("/wallet/{user_id}/transactions")
async def get_user_transactions(user_id: str, limit: int = 50):
    """Get user's transaction history"""
    transactions = await db.transactions.find(
        {"user_id": user_id}
    ).sort("created_at", -1).to_list(limit)
    
    return {"transactions": serialize_doc(transactions)}



# ============= ADMIN DASHBOARD ENDPOINTS =============

from typing import Dict, Any
from datetime import datetime, timedelta

# Admin Stats Dashboard
@api_router.get("/admin/stats")
async def get_admin_stats():
    """Get dashboard statistics for admin"""
    try:
        # Count users
        total_users = await db.users.count_documents({})
        new_users_this_month = await db.users.count_documents({
            "created_at": {"$gte": datetime.utcnow().replace(day=1)}
        })
        
        # Count bookings
        total_bookings = await db.bookings.count_documents({})
        pending_bookings = await db.bookings.count_documents({"status": "pending"})
        paid_bookings = await db.bookings.count_documents({"status": "paid"})
        
        # Count yoga bookings
        total_yoga_bookings = await db.yoga_bookings.count_documents({})
        total_yoga_packages = await db.yoga_purchases.count_documents({})
        total_consultations = await db.yoga_consultations.count_documents({})
        
        # Calculate revenue
        revenue_pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_revenue": {"$sum": "$amount"}
                }
            }
        ]
        credit_transactions = await db.transactions.aggregate([
            {"$match": {"type": "credit"}},
            *revenue_pipeline
        ]).to_list(1)
        
        total_revenue = credit_transactions[0]["total_revenue"] if credit_transactions else 0
        
        # Revenue this month
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        monthly_revenue = await db.transactions.aggregate([
            {"$match": {"type": "credit", "created_at": {"$gte": month_start}}},
            *revenue_pipeline
        ]).to_list(1)
        
        revenue_this_month = monthly_revenue[0]["total_revenue"] if monthly_revenue else 0
        
        # Total wallet balance across all users
        wallet_pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_wallet_balance": {"$sum": "$wallet_balance"}
                }
            }
        ]
        wallet_result = await db.users.aggregate(wallet_pipeline).to_list(1)
        total_wallet_balance = wallet_result[0]["total_wallet_balance"] if wallet_result else 0
        
        return {
            "users": {
                "total": total_users,
                "new_this_month": new_users_this_month,
                "growth_percentage": round((new_users_this_month / max(total_users - new_users_this_month, 1)) * 100, 1)
            },
            "bookings": {
                "total": total_bookings,
                "pending": pending_bookings,
                "paid": paid_bookings,
                "yoga_classes": total_yoga_bookings,
                "yoga_packages": total_yoga_packages,
                "consultations": total_consultations
            },
            "revenue": {
                "total": round(total_revenue, 2),
                "this_month": round(revenue_this_month, 2),
                "wallet_balance": round(total_wallet_balance, 2)
            }
        }
    except Exception as e:
        logger.error(f"Error fetching admin stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get All Users (Admin)
@api_router.get("/admin/users")
async def get_all_users(
    skip: int = 0,
    limit: int = 50,
    search: str = None,
    sort_by: str = "created_at",
    order: str = "desc"
):
    """Get all users with pagination and search"""
    try:
        query = {}
        if search:
            query["$or"] = [
                {"full_name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
                {"phone": {"$regex": search, "$options": "i"}}
            ]
        
        sort_order = -1 if order == "desc" else 1
        
        users = await db.users.find(query).sort(sort_by, sort_order).skip(skip).limit(limit).to_list(limit)
        total = await db.users.count_documents(query)
        
        # Convert ObjectId and remove password hashes
        users_serialized = []
        for user in users:
            user = serialize_doc(user)
            user.pop("password_hash", None)
            users_serialized.append(user)
        
        return {
            "users": users_serialized,
            "total": total,
            "page": skip // limit + 1,
            "pages": (total + limit - 1) // limit
        }
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get All Bookings (Admin)
@api_router.get("/admin/bookings")
async def get_all_bookings(
    skip: int = 0,
    limit: int = 50,
    status: str = None,
    booking_type: str = None  # 'astrology', 'yoga_class', 'yoga_package', 'consultation'
):
    """Get all bookings across all types"""
    try:
        result = {
            "astrology_bookings": [],
            "yoga_class_bookings": [],
            "yoga_package_purchases": [],
            "yoga_consultations": []
        }
        
        # Astrology bookings
        if not booking_type or booking_type == "astrology":
            query = {}
            if status:
                query["status"] = status
            astrology = await db.bookings.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
            result["astrology_bookings"] = serialize_doc(astrology)
        
        # Yoga class bookings
        if not booking_type or booking_type == "yoga_class":
            query = {}
            if status:
                query["status"] = status
            yoga_classes = await db.yoga_bookings.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
            result["yoga_class_bookings"] = serialize_doc(yoga_classes)
        
        # Yoga package purchases
        if not booking_type or booking_type == "yoga_package":
            query = {}
            if status:
                query["status"] = status
            yoga_packages = await db.yoga_purchases.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
            result["yoga_package_purchases"] = serialize_doc(yoga_packages)
        
        # Yoga consultations
        if not booking_type or booking_type == "consultation":
            query = {}
            if status:
                query["status"] = status
            consultations = await db.yoga_consultations.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
            result["yoga_consultations"] = serialize_doc(consultations)
        
        return result
    except Exception as e:
        logger.error(f"Error fetching bookings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get All Transactions (Admin)
@api_router.get("/admin/transactions")
async def get_all_transactions(
    skip: int = 0,
    limit: int = 100,
    transaction_type: str = None,  # 'credit' or 'debit'
    user_id: str = None
):
    """Get all transactions with filters"""
    try:
        query = {}
        if transaction_type:
            query["type"] = transaction_type
        if user_id:
            query["user_id"] = user_id
        
        transactions = await db.transactions.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
        total = await db.transactions.count_documents(query)
        
        return {
            "transactions": serialize_doc(transactions),
            "total": total,
            "page": skip // limit + 1,
            "pages": (total + limit - 1) // limit
        }
    except Exception as e:
        logger.error(f"Error fetching transactions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Update Booking Status (Admin)
class UpdateBookingStatus(BaseModel):
    status: str  # 'pending', 'paid', 'completed', 'cancelled'

@api_router.put("/admin/bookings/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status_data: UpdateBookingStatus,
    booking_type: str = "astrology"  # 'astrology', 'yoga_class', 'yoga_package', 'consultation'
):
    """Update booking status"""
    try:
        collection_map = {
            "astrology": db.bookings,
            "yoga_class": db.yoga_bookings,
            "yoga_package": db.yoga_purchases,
            "consultation": db.yoga_consultations
        }
        
        collection = collection_map.get(booking_type, db.bookings)
        
        result = await collection.update_one(
            {"id": booking_id},
            {"$set": {
                "status": status_data.status,
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        updated_booking = await collection.find_one({"id": booking_id})
        
        return {
            "success": True,
            "message": "Booking status updated",
            "booking": serialize_doc(updated_booking)
        }
    except Exception as e:
        logger.error(f"Error updating booking status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Get Recent Activity (Admin)
@api_router.get("/admin/recent-activity")
async def get_recent_activity(limit: int = 20):
    """Get recent activity across all types"""
    try:
        activities = []
        
        # Recent user signups
        recent_users = await db.users.find().sort("created_at", -1).limit(5).to_list(5)
        for user in recent_users:
            activities.append({
                "type": "user_signup",
                "message": f"{user['full_name']} signed up",
                "timestamp": user["created_at"],
                "user_id": user["id"]
            })
        
        # Recent bookings
        recent_bookings = await db.bookings.find().sort("created_at", -1).limit(5).to_list(5)
        for booking in recent_bookings:
            activities.append({
                "type": "astrology_booking",
                "message": f"New astrology booking - {booking['service_name']}",
                "timestamp": booking["created_at"],
                "booking_id": booking["id"],
                "user_id": booking["user_id"]
            })
        
        # Recent transactions
        recent_transactions = await db.transactions.find().sort("created_at", -1).limit(5).to_list(5)
        for txn in recent_transactions:
            activities.append({
                "type": "transaction",
                "message": f"₹{txn['amount']} {txn['type']} - {txn['description']}",
                "timestamp": txn["created_at"],
                "user_id": txn["user_id"]
            })
        
        # Sort all activities by timestamp
        activities.sort(key=lambda x: x["timestamp"], reverse=True)
        
        return {"activities": activities[:limit]}
    except Exception as e:
        logger.error(f"Error fetching recent activity: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Revenue Analytics (Admin)
@api_router.get("/admin/revenue-analytics")
async def get_revenue_analytics(days: int = 30):
    """Get revenue analytics for the past N days"""
    try:
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Daily revenue
        daily_revenue = await db.transactions.aggregate([
            {
                "$match": {
                    "type": "credit",
                    "created_at": {"$gte": start_date}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$created_at"
                        }
                    },
                    "revenue": {"$sum": "$amount"},
                    "count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id": 1}
            }
        ]).to_list(days)
        
        # Revenue by booking type
        booking_revenue = await db.transactions.aggregate([
            {
                "$match": {
                    "type": "debit",
                    "created_at": {"$gte": start_date}
                }
            },
            {
                "$group": {
                    "_id": "$description",
                    "revenue": {"$sum": "$amount"},
                    "count": {"$sum": 1}
                }
            }
        ]).to_list(100)
        
        return {
            "daily_revenue": daily_revenue,
            "booking_revenue": booking_revenue,
            "period_days": days
        }
    except Exception as e:
        logger.error(f"Error fetching revenue analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Delete User (Admin)
@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str):
    """Delete a user and all their data"""
    try:
        # Delete user
        result = await db.users.delete_one({"id": user_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Delete user's bookings
        await db.bookings.delete_many({"user_id": user_id})
        await db.yoga_bookings.delete_many({"user_id": user_id})
        await db.yoga_purchases.delete_many({"user_id": user_id})
        await db.yoga_consultations.delete_many({"user_id": user_id})
        
        # Delete user's transactions
        await db.transactions.delete_many({"user_id": user_id})
        
        return {
            "success": True,
            "message": "User and all associated data deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Update User Wallet (Admin)
class AdminWalletUpdate(BaseModel):
    amount: float
    action: str  # 'add' or 'deduct'
    reason: str

@api_router.post("/admin/users/{user_id}/wallet")
async def admin_update_wallet(user_id: str, wallet_data: AdminWalletUpdate):
    """Admin endpoint to add or deduct wallet balance"""
    try:
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        current_balance = user.get("wallet_balance", 0)
        
        if wallet_data.action == "add":
            new_balance = current_balance + wallet_data.amount
            transaction_type = "credit"
        elif wallet_data.action == "deduct":
            if current_balance < wallet_data.amount:
                raise HTTPException(status_code=400, detail="Insufficient balance")
            new_balance = current_balance - wallet_data.amount
            transaction_type = "debit"
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        # Update wallet
        await db.users.update_one(
            {"id": user_id},
            {"$set": {"wallet_balance": new_balance}}
        )
        
        # Create transaction
        transaction = TransactionRecord(
            user_id=user_id,
            type=transaction_type,
            amount=wallet_data.amount,
            balance_after=new_balance,
            description=f"Admin: {wallet_data.reason}",
        )
        await db.transactions.insert_one(transaction.dict())
        
        return {
            "success": True,
            "message": f"Wallet {wallet_data.action}ed successfully",
            "new_balance": new_balance
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating wallet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============= ASTROLOGER DASHBOARD ENDPOINTS =============

@api_router.get("/astrologers/bookings")
async def get_astrologer_bookings(name: str):
    """Get all bookings for a specific astrologer by name"""
    try:
        if not name or name == "undefined":
            raise HTTPException(status_code=400, detail="Astrologer name is required")
        
        # Find all bookings for this astrologer
        bookings = await db.bookings.find({"astrologer_name": name}).sort("created_at", -1).to_list(200)
        
        # Fetch user details for each booking
        enriched_bookings = []
        for booking in bookings:
            user = await db.users.find_one({"id": booking["user_id"]})
            enriched_booking = serialize_doc(booking)
            if user:
                enriched_booking["user_name"] = user.get("full_name", "Unknown")
                enriched_booking["user_email"] = user.get("email", "")
                enriched_booking["user_phone"] = user.get("phone", "")
            else:
                enriched_booking["user_name"] = "Unknown User"
                enriched_booking["user_email"] = ""
                enriched_booking["user_phone"] = ""
            
            # Map database fields to frontend expected fields
            enriched_booking["duration"] = enriched_booking.get("service_duration", "")
            
            enriched_bookings.append(enriched_booking)
        
        return {"bookings": enriched_bookings}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching astrologer bookings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/astrologers/stats")
async def get_astrologer_stats(name: str):
    """Get statistics for a specific astrologer"""
    try:
        if not name or name == "undefined":
            raise HTTPException(status_code=400, detail="Astrologer name is required")
        
        # Get all bookings for this astrologer
        all_bookings = await db.bookings.find({"astrologer_name": name}).to_list(1000)
        
        # Calculate stats
        total_bookings = len(all_bookings)
        completed_bookings = len([b for b in all_bookings if b.get("status") == "completed"])
        pending_bookings = len([b for b in all_bookings if b.get("status") == "pending"])
        cancelled_bookings = len([b for b in all_bookings if b.get("status") == "cancelled"])
        
        # Calculate earnings
        total_earnings = sum(b.get("service_price", 0) for b in all_bookings if b.get("status") in ["paid", "completed"])
        
        # This month earnings
        month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_bookings = [b for b in all_bookings if b.get("created_at", datetime.min) >= month_start]
        this_month_earnings = sum(b.get("service_price", 0) for b in this_month_bookings if b.get("status") in ["paid", "completed"])
        
        # This week bookings
        week_start = datetime.utcnow() - timedelta(days=7)
        this_week_bookings = len([b for b in all_bookings if b.get("created_at", datetime.min) >= week_start])
        
        # Get astrologer profile for rating and reviews
        from bson.objectid import ObjectId
        astrologer = await db.astrologers.find_one({"name": name})
        
        average_rating = astrologer.get("rating", 0) if astrologer else 0
        total_reviews = astrologer.get("reviews", 0) if astrologer else 0
        
        return {
            "total_bookings": total_bookings,
            "completed_bookings": completed_bookings,
            "pending_bookings": pending_bookings,
            "cancelled_bookings": cancelled_bookings,
            "total_earnings": round(total_earnings, 2),
            "this_month_earnings": round(this_month_earnings, 2),
            "this_week_bookings": this_week_bookings,
            "average_rating": average_rating,
            "total_reviews": total_reviews
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching astrologer stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.put("/astrologers/bookings/{booking_id}/status")
async def update_astrologer_booking_status(
    booking_id: str,
    status_data: UpdateBookingStatus
):
    """Update booking status from astrologer dashboard"""
    try:
        result = await db.bookings.update_one(
            {"id": booking_id},
            {"$set": {
                "status": status_data.status,
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        updated_booking = await db.bookings.find_one({"id": booking_id})
        
        return {
            "success": True,
            "message": "Booking status updated successfully",
            "booking": serialize_doc(updated_booking)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating booking status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
