# Celestials - India ka pehla second opinion app

**An outcome-driven astrology-tech platform for India**

![Status](https://img.shields.io/badge/status-ready%20for%20deployment-success)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![Tailwind](https://img.shields.io/badge/tailwind-4.1.12-38bdf8)

---

## 🌟 About

Celestials is a modern astrology consultation platform that revolutionizes the industry with **transparent, fixed-duration sessions** instead of per-minute billing. Built with React and Tailwind CSS, this application provides a warm, trustworthy user experience with a premium beige and gold color scheme.

### Key Features

- ✨ **No Per-Minute Billing** - Revolutionary fixed-price session model
- 🎯 **5 Session Tiers** - From 20-minute "Aarambh" to 90-minute "Anant"
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🎨 **Premium Design** - Warm beige, deep brown, and soft gold aesthetic
- ⚡ **Fast & Modern** - Built with Vite and React 18

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev

# Build for production
pnpm build
# or
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📖 Documentation

### For Developers
- **[DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)** - Complete technical documentation, integration guide, and deployment options
- **[DEPLOY_TO_GOOGLE.md](./DEPLOY_TO_GOOGLE.md)** - Step-by-step guide for deploying to Google Cloud Platform

### Project Structure
```
celestials-app/
├── src/app/
│   ├── pages/           # Home, Features, HowItWorks
│   ├── components/      # Reusable components
│   └── routes.tsx       # React Router setup
├── src/styles/          # Theme and global styles
└── package.json         # Dependencies
```

---

## 🎨 Session Tiers

| Tier | Duration | Price | Best For |
|------|----------|-------|----------|
| **Aarambh** | 20 min | ₹299 | Quick questions |
| **Manan** | 30 min | ₹449 | Specific concerns |
| **Samadhan** | 45 min | ₹649 | Detailed guidance |
| **Vishwas** | 60 min | ₹849 | Comprehensive analysis |
| **Anant** | 90 min | ₹1,199 | Deep consultation |

---

## 🛠️ Tech Stack

- **Frontend:** React 18.3.1
- **Routing:** React Router 7.13.0
- **Styling:** Tailwind CSS 4.1.12
- **Build Tool:** Vite 6.3.5
- **UI Components:** Radix UI, Lucide Icons
- **Animations:** Motion (Framer Motion)
- **Form Handling:** React Hook Form 7.55.0

---

## 🌐 Deployment

### Recommended: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

Your app will be live at `https://your-project.web.app`

**For detailed deployment instructions, see [DEPLOY_TO_GOOGLE.md](./DEPLOY_TO_GOOGLE.md)**

### Other Options
- Vercel (one-click deployment)
- Netlify (auto-deployment from Git)
- Google Cloud Run (containerized)
- AWS Amplify

---

## 📱 Pages

1. **Home (/)** - Hero section with value proposition and tagline
2. **Features (/features)** - Platform capabilities and benefits
3. **How It Works (/how-it-works)** - Session tiers with prominent "No Per-Minute Billing" messaging

---

## 🎯 What's Ready

✅ Full responsive design  
✅ Multi-page routing configured  
✅ Premium UI components  
✅ Design system implementation  
✅ Production build setup  
✅ Ready for backend integration  

## 🔜 Next Steps for Integration

1. **Backend API Setup** - User auth, session booking, payments
2. **Payment Gateway** - Razorpay/Paytm integration
3. **Database** - User profiles, bookings, transactions
4. **Video Calling** - Live consultation integration
5. **Admin Panel** - Manage astrologers and sessions

See [DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md) for detailed integration guide.

---

## 🤝 Handing Off to Developer

This project is **ready for developer handoff**. Your developer needs:

1. **This entire codebase** (all files in this directory)
2. **Read [DEVELOPER_HANDOFF.md](./DEVELOPER_HANDOFF.md)** for complete technical details
3. **Read [DEPLOY_TO_GOOGLE.md](./DEPLOY_TO_GOOGLE.md)** for deployment on Google

### Quick Handoff Steps:

**Option 1: Share as ZIP file**
- Download all project files
- Send ZIP to your developer
- Developer extracts and runs `npm install` → `npm run dev`

**Option 2: GitHub Repository**
- Create a new GitHub repo
- Push this code to the repo
- Give developer access
- Developer clones and starts working

**Option 3: Direct Deploy (No Developer Needed)**
- Follow [DEPLOY_TO_GOOGLE.md](./DEPLOY_TO_GOOGLE.md)
- Deploy to Firebase Hosting yourself
- Share live link with developer for backend integration later

---

## 📄 License

[Add your license here]

---

## 💬 Support

For questions about this codebase:
- Check the comments in component files
- Review `/src/styles/theme.css` for design tokens
- See routing setup in `/src/app/routes.tsx`

---

## 🙏 Credits

Built with modern web technologies:
- React
- Tailwind CSS
- Vite
- Radix UI

---

**Version:** 1.0.0  
**Status:** ✅ Ready for Production Deployment  
**Last Updated:** March 11, 2026

---

### 🎉 Your app is production-ready!

Choose your deployment path:
- **Fast & Easy:** Firebase Hosting (see DEPLOY_TO_GOOGLE.md)
- **Full Control:** Backend integration (see DEVELOPER_HANDOFF.md)
- **Both:** Deploy frontend now, integrate backend later

**Questions?** Everything you need is in the documentation files included with this project.
