# Celestials Healing - Local Setup Guide

## 📋 Prerequisites

- **Python 3.10+** (you have 3.13 ✅)
- **Node.js 18+** 
- **Yarn** or **npm**
- **MongoDB Atlas** account (or local MongoDB)
- **Razorpay** account for payments

---

## 🔧 Backend Setup (FastAPI)

### Step 1: Navigate to backend folder
```bash
cd backend
```

### Step 2: Create virtual environment (recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python -m venv venv
source venv/bin/activate
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure environment variables
Create a `.env` file in the `backend` folder:
```env
MONGO_URL="mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/"
DB_NAME="celestials_healing"
RAZORPAY_KEY_ID="rzp_live_RN3ZMbtDzMZOLC"
RAZORPAY_KEY_SECRET="your_razorpay_secret_key_here"
```

### Step 5: Run the backend server
```bash
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

✅ Backend runs at: `http://localhost:8001`
✅ API Docs: `http://localhost:8001/docs`

---

## 📱 Frontend Setup (Expo/React Native)

### Step 1: Navigate to frontend folder
```bash
cd frontend
```

### Step 2: Install dependencies
```bash
# Using Yarn (recommended)
yarn install

# OR using npm
npm install
```

### Step 3: Configure environment variables
Create a `.env` file in the `frontend` folder:
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
EXPO_PUBLIC_RAZORPAY_KEY_ID=rzp_live_RN3ZMbtDzMZOLC
```

**⚠️ For mobile testing (Expo Go), use your computer's IP address:**
```env
EXPO_PUBLIC_BACKEND_URL=http://192.168.x.x:8001
```
(Find your IP: Run `ipconfig` on Windows or `ifconfig` on Mac/Linux)

### Step 4: Start the Expo development server
```bash
# Start Expo
npx expo start

# OR with tunnel for mobile testing (recommended)
npx expo start --tunnel
```

---

## 🧪 Testing the App

| Platform | How to Test |
|----------|-------------|
| **Web Browser** | Press `w` after `expo start` opens `http://localhost:8080` |
| **Android** | Install **Expo Go** app → Scan QR code |
| **iOS** | Install **Expo Go** app → Scan QR code with Camera |
| **API Testing** | Open `http://localhost:8001/docs` in browser |

---

## 🔑 Getting API Keys

### MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/atlas
2. Create free cluster
3. Get connection string from "Connect" → "Connect your application"
4. Replace `<password>` with your database password

### Razorpay
1. Go to https://dashboard.razorpay.com
2. Navigate to Settings → API Keys
3. Generate/copy your Key ID and Key Secret

---

## 📁 Project Structure

```
yoga-app/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Environment variables
│
└── frontend/
    ├── app/               # Expo Router screens
    ├── components/        # Reusable components
    ├── context/           # React Context (UserContext)
    ├── package.json       # Node dependencies
    └── .env               # Environment variables
```

---

## 🚀 Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npx expo start --tunnel
```

---

## ❓ Common Issues

### "Module not found" errors
```bash
pip install <module_name>
# or
yarn add <package_name>
```

### "Connection refused" on mobile
- Use your computer's IP instead of `localhost`
- Make sure both devices are on the same WiFi network
- Check if firewall is blocking port 8001

### Razorpay "Authentication failed"
- Make sure you've added the correct `RAZORPAY_KEY_SECRET` in backend `.env`
- Restart the backend server after updating `.env`

---

## 📞 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/bookings` | POST | Create astrology booking |
| `/api/yoga/class-booking` | POST | Book yoga class |
| `/api/yoga/package-purchase` | POST | Buy yoga package |
| `/api/yoga/consultation` | POST | Book consultation |
| `/api/payment/create-order` | POST | Create Razorpay order |
| `/api/payment/verify` | POST | Verify payment |
| `/api/wallet/{user_id}` | GET | Get wallet balance |
| `/api/wallet/deduct` | POST | Deduct from wallet |

---

Happy coding! 🙏✨
