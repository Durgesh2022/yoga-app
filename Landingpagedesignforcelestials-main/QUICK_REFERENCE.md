# ⚡ Quick Reference Card - Celestials

**One-page guide for common tasks**

---

## 🚀 Deploy in 3 Commands

```bash
npm install
npm run build
firebase deploy --only hosting
```

**First time?** Need Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

---

## 📱 Test Locally

```bash
npm install        # Install dependencies
npm run dev        # Start local server
```

Open: http://localhost:5173

---

## 📚 Which Guide Do I Read?

| Your Situation | Read This |
|----------------|-----------|
| "Where do I start?" | `START_HERE.md` |
| "What is this project?" | `README.md` |
| "I want to deploy myself" | `DEPLOY_YOURSELF.md` |
| "I have a developer" | `HANDOFF_CHECKLIST.md` |
| "I am the developer" | `DEVELOPER_HANDOFF.md` |
| "Deploy to Google Cloud" | `DEPLOY_TO_GOOGLE.md` |
| "What files are where?" | `PROJECT_STRUCTURE.md` |

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Login to Firebase
firebase login

# Check your deployments
firebase hosting:sites:list

# View Firebase project
firebase open hosting:site
```

---

## 📂 Key Files & Folders

```
/START_HERE.md              ← Read this first
/README.md                  ← Project overview
/package.json               ← Dependencies
/firebase.json              ← Deployment config

/src/app/pages/             ← Your pages
  ├── Home.tsx              ← Landing page
  ├── Features.tsx          ← Features page
  └── HowItWorks.tsx        ← Session tiers

/src/app/components/        ← Components
  └── Layout.tsx            ← Navigation & footer

/src/styles/                ← Styling
  └── theme.css             ← Colors & design tokens
```

---

## 🎨 Session Tiers

| Tier | Duration | Price |
|------|----------|-------|
| Aarambh | 20 min | ₹299 |
| Manan | 30 min | ₹449 |
| Samadhan | 45 min | ₹649 |
| Vishwas | 60 min | ₹849 |
| Anant | 90 min | ₹1,199 |

Found in: `src/app/pages/HowItWorks.tsx`

---

## 🌐 URLs After Deployment

You'll get:
- `https://your-project.web.app`
- `https://your-project.firebaseapp.com`

Both work the same!

---

## 🔄 Update Deployed App

```bash
# Make your changes in code
# Then:
npm run build
firebase deploy --only hosting
```

Live in 30 seconds! ⚡

---

## 🎯 Add New Page

1. Create: `src/app/pages/NewPage.tsx`
2. Edit: `src/app/routes.tsx` (add route)
3. Edit: `src/app/components/Layout.tsx` (add nav link)
4. Build: `npm run build`
5. Deploy: `firebase deploy`

---

## 🎨 Change Colors

Edit: `src/styles/theme.css`

```css
--color-beige: #F5EFE7;   /* Change this */
--color-brown: #3E2723;   /* Or this */
--color-gold: #D4AF37;    /* Or this */
```

Then rebuild: `npm run build`

---

## 📱 Pages & Routes

| URL | File | Description |
|-----|------|-------------|
| `/` | `Home.tsx` | Landing page |
| `/features` | `Features.tsx` | Features page |
| `/how-it-works` | `HowItWorks.tsx` | Session tiers |

---

## 🐛 Troubleshooting

### "Command not found"
```bash
npm install -g firebase-tools
```

### Build failed
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Changes not showing
```bash
# Clear cache
npm run build
firebase deploy --only hosting
# Hard refresh browser: Ctrl+Shift+R
```

---

## 💰 Hosting Costs

**Firebase Free Tier:**
- 10 GB storage
- 360 MB/day bandwidth
- Perfect for starting!

**Paid (if exceeded):**
- ~₹300-1000/month for small business
- Pay only what you use

---

## 📞 Get Help

- Firebase: https://console.firebase.google.com
- React Docs: https://react.dev
- Tailwind: https://tailwindcss.com

---

## ✅ Pre-Deployment Checklist

- [ ] `npm install` completed
- [ ] `npm run dev` works locally
- [ ] All pages load correctly
- [ ] Mobile responsive (test by resizing browser)
- [ ] `firebase login` successful
- [ ] `npm run build` successful
- [ ] Ready for `firebase deploy`

---

## 🎁 What's Included

✅ 3 pages (Home, Features, How It Works)  
✅ Responsive design  
✅ React Router navigation  
✅ Premium UI components  
✅ Tailwind CSS styling  
✅ Firebase config ready  
✅ Production build setup  

---

## 🔜 What's NOT Included (Needs Backend)

❌ User login/signup  
❌ Session booking  
❌ Payment processing  
❌ Database  
❌ Video calling  
❌ Admin panel  

**For backend:** See `DEVELOPER_HANDOFF.md`

---

## 🚦 Project Status

**Frontend:** ✅ 100% Complete  
**Backend:** ⏸️ Not started  
**Deployment:** ⏸️ Ready (run `firebase deploy`)  

---

## ⚡ Super Quick Deploy

**Windows:** Double-click `deploy.bat`  
**Mac/Linux:** Run `./deploy.sh`

That's it! 🎉

---

## 📧 Share With Developer

Send them:
1. All project files (ZIP or GitHub)
2. This message:

```
"Read START_HERE.md to get oriented.
Then read DEVELOPER_HANDOFF.md for technical details.
The frontend is ready - we need backend integration."
```

---

## 🎯 Three Most Important Files

1. **`START_HERE.md`** - Begin here
2. **`DEPLOY_YOURSELF.md`** - Deploy guide
3. **`DEVELOPER_HANDOFF.md`** - Technical docs

---

## 💡 Pro Tips

- Always run `npm run build` before deploying
- Test locally with `npm run dev` first
- Use `firebase deploy --only hosting` (faster)
- Hard refresh browser after deploy: Ctrl+Shift+R
- Keep `package.json` - your developer needs it

---

## 🎓 Tech Stack

- **React:** 18.3.1
- **Tailwind CSS:** 4.1.12
- **Vite:** 6.3.5
- **React Router:** 7.13.0

---

**🌟 You're ready to go! Open `START_HERE.md` and choose your path.**

Save this file for quick reference! 📌
