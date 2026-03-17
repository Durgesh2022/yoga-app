# Celestials - Developer Handoff Documentation

## Project Overview

**Celestials** is an outcome-driven astrology-tech platform for India. This is a multi-page React + Tailwind CSS web application ready for backend integration and deployment.

**Tagline:** "India ka pehla second opinion app"

**Design System:**
- **Colors:** Light beige (#F5EFE7), deep brown (#3E2723), soft gold (#D4AF37)
- **Aesthetic:** Warm, trustworthy, modern
- **Key Features:** No per-minute billing, fixed-duration session tiers

---

## 🚀 Quick Start for Developers

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm** (this project uses pnpm)

### Installation

```bash
# Clone or download the project files
cd celestials-app

# Install dependencies
pnpm install
# OR
npm install

# Start development server
pnpm dev
# OR
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
pnpm build
# OR
npm run build

# The output will be in the /dist folder
```

---

## 📁 Project Structure

```
celestials-app/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main entry point
│   │   ├── routes.tsx           # React Router configuration
│   │   ├── components/
│   │   │   ├── Layout.tsx       # Main layout with navigation
│   │   │   ├── figma/           # Figma-specific components
│   │   │   └── ui/              # Reusable UI components
│   │   └── pages/
│   │       ├── Home.tsx         # Landing page
│   │       ├── Features.tsx     # Features showcase
│   │       └── HowItWorks.tsx   # Session tiers explanation
│   ├── styles/
│   │   ├── index.css           # Global styles
│   │   ├── tailwind.css        # Tailwind imports
│   │   ├── theme.css           # Design tokens & theme
│   │   └── fonts.css           # Font imports
│   └── imports/                # Imported assets
├── package.json                # Dependencies
├── vite.config.ts             # Vite configuration
└── postcss.config.mjs         # PostCSS configuration
```

---

## 🎨 Design Implementation

### Pages Included

1. **Home Page** (`/`)
   - Hero section with tagline
   - Value propositions
   - Call-to-action

2. **Features Page** (`/features`)
   - Platform capabilities
   - Benefits showcase

3. **How It Works Page** (`/how-it-works`)
   - **Session Tiers:**
     - **Aarambh** (20 min) - ₹299
     - **Manan** (30 min) - ₹449
     - **Samadhan** (45 min) - ₹649
     - **Vishwas** (60 min) - ₹849
     - **Anant** (90 min) - ₹1,199
   - Prominent "No Per-Minute Billing" messaging
   - Celestials logo watermark background

### Design System Details

The design uses Tailwind CSS v4 with custom theme tokens defined in `/src/styles/theme.css`:

```css
/* Key color variables */
--color-beige: #F5EFE7;
--color-brown: #3E2723;
--color-gold: #D4AF37;
```

---

## 🔧 Integration Points for Backend

### 1. API Integration

You'll need to integrate APIs for:

- **User Authentication**
  - Login/signup functionality
  - Session management
  - OAuth integration (Google, etc.)

- **Booking System**
  - Session tier selection
  - Date/time scheduling
  - Payment processing
  - Booking confirmation

- **User Dashboard**
  - Past sessions
  - Upcoming appointments
  - Astrologer profiles

### 2. Payment Gateway

Integrate payment providers like:
- Razorpay (recommended for India)
- Paytm
- PhonePe
- Stripe

### 3. Database Requirements

Tables needed:
- `users` - User accounts
- `astrologers` - Astrologer profiles
- `sessions` - Booking records
- `payments` - Payment transactions
- `reviews` - User feedback

### 4. Real-time Features (Optional)

- Video call integration (Zoom, Agora, Twilio)
- Chat functionality
- Notifications (Email, SMS, Push)

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

**Benefits:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier available

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option 3: Google Cloud Platform (GCP)

#### Using Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

#### Using Cloud Run (for containerized deployment)

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Build and deploy:
```bash
gcloud builds submit --tag gcr.io/YOUR-PROJECT-ID/celestials
gcloud run deploy celestials --image gcr.io/YOUR-PROJECT-ID/celestials --platform managed
```

### Option 4: AWS

- **S3 + CloudFront**: Static hosting
- **Amplify**: Full-stack deployment
- **EC2**: Custom server deployment

---

## 🔑 Environment Variables

Create a `.env` file for environment-specific configuration:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.celestials.in
VITE_API_KEY=your_api_key_here

# Payment Gateway
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_PAYTM_MID=your_paytm_mid

# Analytics
VITE_GA_TRACKING_ID=your_google_analytics_id

# Feature Flags
VITE_ENABLE_VIDEO_CALLS=true
VITE_ENABLE_CHAT=true
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend.

---

## 📦 NPM Packages Used

### Core Dependencies
- **React 18.3.1** - UI library
- **React Router 7.13.0** - Routing
- **Tailwind CSS 4.1.12** - Styling
- **Vite 6.3.5** - Build tool

### UI Components
- **@radix-ui/** - Accessible component primitives
- **lucide-react** - Icon library
- **motion** - Animations
- **recharts** - Charts (if needed for analytics)

### Form Handling
- **react-hook-form** - Form management

### Other Utilities
- **clsx** - Conditional classnames
- **tailwind-merge** - Merge Tailwind classes
- **date-fns** - Date utilities

---

## 🔒 Security Considerations

1. **API Keys:**
   - Never commit `.env` files
   - Use environment variables for all sensitive data
   - Rotate keys regularly

2. **Authentication:**
   - Implement JWT tokens or session-based auth
   - Use HTTPS only in production
   - Implement rate limiting

3. **Payment Security:**
   - PCI DSS compliance
   - Never store card details
   - Use tokenization

4. **Data Privacy:**
   - GDPR/India data protection compliance
   - User consent management
   - Secure data storage

---

## 📱 Mobile Responsiveness

The application is fully responsive and tested on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

All components use responsive Tailwind classes.

---

## 🧪 Testing Recommendations

### Unit Testing
```bash
# Install testing libraries
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# Add test script to package.json
"test": "vitest"
```

### E2E Testing
```bash
# Install Playwright or Cypress
pnpm add -D @playwright/test
```

---

## 🎯 Next Steps for Integration

### Phase 1: Backend Setup
1. Set up backend API (Node.js/Express, Python/Django, or your choice)
2. Configure database (PostgreSQL, MongoDB, etc.)
3. Implement authentication system
4. Create API endpoints for session booking

### Phase 2: Payment Integration
1. Register with payment gateway (Razorpay recommended)
2. Implement payment flow in frontend
3. Set up webhooks for payment confirmation
4. Create invoice generation

### Phase 3: Feature Enhancements
1. Add user dashboard
2. Implement astrologer profiles
3. Add review/rating system
4. Integrate video calling
5. Build admin panel

### Phase 4: Testing & Launch
1. QA testing
2. Load testing
3. Security audit
4. Soft launch (beta users)
5. Production deployment

---

## 📞 Technical Support

For questions about this codebase:
1. Review the code comments in each component
2. Check the Tailwind theme configuration in `/src/styles/theme.css`
3. Refer to the routing setup in `/src/app/routes.tsx`

---

## 📄 License

[Add your license information here]

---

## 🙏 Acknowledgments

Built with React, Tailwind CSS, and modern web technologies.

---

**Version:** 1.0.0  
**Last Updated:** March 11, 2026  
**Status:** Ready for Backend Integration

---

## Quick Deployment Checklist

- [ ] Install dependencies (`pnpm install`)
- [ ] Test locally (`pnpm dev`)
- [ ] Create `.env` file with API keys
- [ ] Build production bundle (`pnpm build`)
- [ ] Choose hosting platform (Vercel/Netlify/Firebase/GCP)
- [ ] Configure domain and DNS
- [ ] Set up SSL certificate (auto on Vercel/Netlify)
- [ ] Deploy to production
- [ ] Test production build
- [ ] Set up monitoring and analytics
- [ ] Configure error tracking (Sentry, etc.)

**Your app is now ready to go live! 🚀**
