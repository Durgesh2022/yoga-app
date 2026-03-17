# 📁 Celestials Project Structure

Complete overview of all files and folders in this project.

---

## 📋 Quick Navigation

### 🌟 **START HERE**
- **`START_HERE.md`** - Choose your path (deploy yourself, give to developer, etc.)

### 📚 Documentation (Choose Based on Your Need)
- **`README.md`** - Quick project overview (5-min read)
- **`DEPLOY_YOURSELF.md`** - Non-technical deployment guide
- **`HANDOFF_CHECKLIST.md`** - How to give code to developer
- **`DEVELOPER_HANDOFF.md`** - Complete technical documentation
- **`DEPLOY_TO_GOOGLE.md`** - Google Cloud Platform deployment
- **`PROJECT_STRUCTURE.md`** - This file

### 🚀 Deployment Scripts
- **`deploy.sh`** - Automated deployment (Mac/Linux)
- **`deploy.bat`** - Automated deployment (Windows)

---

## 🗂️ Complete File Tree

```
celestials-app/
│
├── 📚 Documentation Files (NEW - For Handoff)
│   ├── START_HERE.md                    # Main entry point - read this first
│   ├── README.md                        # Project overview
│   ├── DEPLOY_YOURSELF.md               # Self-deployment guide
│   ├── HANDOFF_CHECKLIST.md             # Developer handoff guide
│   ├── DEVELOPER_HANDOFF.md             # Technical documentation
│   ├── DEPLOY_TO_GOOGLE.md              # Google Cloud deployment
│   ├── PROJECT_STRUCTURE.md             # This file
│   └── ATTRIBUTIONS.md                  # Credits and licenses
│
├── 🚀 Deployment Tools (NEW)
│   ├── deploy.sh                        # Deployment script (Mac/Linux)
│   ├── deploy.bat                       # Deployment script (Windows)
│   ├── firebase.json                    # Firebase hosting config
│   └── .firebaserc                      # Firebase project config
│
├── ⚙️ Configuration Files
│   ├── package.json                     # Dependencies & scripts
│   ├── vite.config.ts                   # Vite build configuration
│   └── postcss.config.mjs               # PostCSS configuration
│
├── 📱 Source Code (src/)
│   │
│   ├── app/
│   │   │
│   │   ├── 📄 App.tsx                   # Main entry point
│   │   ├── 📄 routes.tsx                # React Router configuration
│   │   │
│   │   ├── pages/                       # All page components
│   │   │   ├── Home.tsx                 # Landing page (/)
│   │   │   ├── Features.tsx             # Features page (/features)
│   │   │   └── HowItWorks.tsx           # How it works (/how-it-works)
│   │   │
│   │   └── components/                  # Reusable components
│   │       │
│   │       ├── Layout.tsx               # Main layout with navigation
│   │       │
│   │       ├── figma/                   # Figma-specific components
│   │       │   └── ImageWithFallback.tsx  # Image component
│   │       │
│   │       └── ui/                      # UI component library
│   │           ├── accordion.tsx
│   │           ├── alert-dialog.tsx
│   │           ├── alert.tsx
│   │           ├── aspect-ratio.tsx
│   │           ├── avatar.tsx
│   │           ├── badge.tsx
│   │           ├── breadcrumb.tsx
│   │           ├── button.tsx
│   │           ├── calendar.tsx
│   │           ├── card.tsx
│   │           ├── carousel.tsx
│   │           ├── chart.tsx
│   │           ├── checkbox.tsx
│   │           ├── collapsible.tsx
│   │           ├── command.tsx
│   │           ├── context-menu.tsx
│   │           ├── dialog.tsx
│   │           ├── drawer.tsx
│   │           ├── dropdown-menu.tsx
│   │           ├── form.tsx
│   │           ├── hover-card.tsx
│   │           ├── input-otp.tsx
│   │           ├── input.tsx
│   │           ├── label.tsx
│   │           ├── menubar.tsx
│   │           ├── navigation-menu.tsx
│   │           ├── pagination.tsx
│   │           ├── popover.tsx
│   │           ├── progress.tsx
│   │           ├── radio-group.tsx
│   │           ├── resizable.tsx
│   │           ├── scroll-area.tsx
│   │           ├── select.tsx
│   │           ├── separator.tsx
│   │           ├── sheet.tsx
│   │           ├── sidebar.tsx
│   │           ├── skeleton.tsx
│   │           ├── slider.tsx
│   │           ├── sonner.tsx
│   │           ├── switch.tsx
│   │           ├── table.tsx
│   │           ├── tabs.tsx
│   │           ├── textarea.tsx
│   │           ├── toggle-group.tsx
│   │           ├── toggle.tsx
│   │           ├── tooltip.tsx
│   │           ├── use-mobile.ts
│   │           └── utils.ts
│   │
│   ├── styles/                          # Styling files
│   │   ├── index.css                    # Global styles
│   │   ├── tailwind.css                 # Tailwind imports
│   │   ├── theme.css                    # Design tokens & theme
│   │   └── fonts.css                    # Font imports
│   │
│   └── imports/                         # Imported assets
│       └── pasted_text/
│           └── celestials-how-it-works.md
│
└── 📖 Guidelines (Internal)
    └── guidelines/
        └── Guidelines.md
```

---

## 📊 File Count Summary

### Documentation
- 8 documentation files (including this one)

### Configuration
- 5 configuration files
- 2 deployment scripts

### Source Code
- 3 page components
- 1 layout component
- 45+ UI components
- 4 style files
- Various assets

**Total:** ~70+ files

---

## 🎯 Files by Purpose

### 📖 Read First
1. `START_HERE.md` - Orientation guide
2. `README.md` - Project overview

### 🚀 For Deployment
- `DEPLOY_YOURSELF.md` - Non-technical guide
- `DEPLOY_TO_GOOGLE.md` - Technical guide
- `deploy.sh` / `deploy.bat` - Automation scripts
- `firebase.json` - Firebase configuration

### 👨‍💻 For Developers
- `DEVELOPER_HANDOFF.md` - Technical documentation
- `package.json` - Dependencies
- `vite.config.ts` - Build configuration
- `src/app/routes.tsx` - Routing

### 🎨 For Design
- `src/styles/theme.css` - Design tokens
- `src/styles/tailwind.css` - Tailwind setup
- `src/pages/*.tsx` - Page layouts

### ⚙️ Don't Touch (Auto-Generated)
- `node_modules/` - Installed packages (after npm install)
- `dist/` - Build output (after npm run build)
- `pnpm-lock.yaml` - Lock file

---

## 🔑 Key Files Explained

### `package.json`
Lists all dependencies and scripts. Your developer will reference this.

**Key scripts:**
```json
{
  "dev": "vite",           // Run locally
  "build": "vite build"    // Build for production
}
```

### `firebase.json`
Configuration for Firebase Hosting deployment.

**What it does:**
- Points to `dist` folder (build output)
- Configures single-page app routing
- Sets security headers
- Sets cache rules

### `src/app/App.tsx`
Main entry point of the React application.

**What it does:**
- Sets up React Router
- Renders the app

### `src/app/routes.tsx`
Defines all page routes.

**Current routes:**
- `/` → Home page
- `/features` → Features page
- `/how-it-works` → How It Works page

### `src/app/components/Layout.tsx`
Main layout wrapper with navigation.

**Includes:**
- Header with navigation
- Footer
- Responsive menu
- Logo

### `src/styles/theme.css`
Design system tokens.

**Defines:**
- Color palette (beige, brown, gold)
- Typography scale
- Spacing system
- Border radius
- Shadows

---

## 📝 Files You Might Edit

### To Add a New Page
1. Create `src/app/pages/YourPage.tsx`
2. Update `src/app/routes.tsx` to add route
3. Add navigation link in `src/app/components/Layout.tsx`

### To Change Colors
1. Edit `src/styles/theme.css`
2. Update color variables
3. Rebuild with `npm run build`

### To Change Content
1. Edit respective page in `src/app/pages/`
2. Update text, images, or layout
3. Save and refresh browser

### To Add a New Component
1. Create `src/app/components/YourComponent.tsx`
2. Import in page where needed
3. Use like any React component

---

## 🚫 Files NOT to Edit

### System Files
- `node_modules/` - Auto-generated
- `dist/` - Auto-generated
- `pnpm-lock.yaml` - Auto-managed
- `.firebaserc` - Auto-configured
- `src/app/components/figma/ImageWithFallback.tsx` - Protected

### Configuration Files (Unless You Know What You're Doing)
- `vite.config.ts`
- `postcss.config.mjs`
- `firebase.json` (already optimized)

---

## 📦 What Gets Deployed

When you run `npm run build`, only these files go to production:

```
dist/
├── index.html           # Main HTML
├── assets/
│   ├── *.js            # JavaScript bundles
│   ├── *.css           # Stylesheets
│   └── *.png/jpg/svg   # Images
└── ...
```

**Size:** ~500KB - 2MB (compressed)  
**Load Time:** < 2 seconds on 3G

---

## 🔍 Finding Specific Code

### Session Tiers
→ `src/app/pages/HowItWorks.tsx`

### Navigation Menu
→ `src/app/components/Layout.tsx`

### Color Scheme
→ `src/styles/theme.css`

### Routing
→ `src/app/routes.tsx`

### Home Page Hero
→ `src/app/pages/Home.tsx`

### Features List
→ `src/app/pages/Features.tsx`

---

## 📈 Project Size

### Before Build
- Source files: ~5-10 MB
- node_modules: ~200-400 MB

### After Build (dist/)
- Production files: ~500 KB - 2 MB
- Optimized and compressed

### What Users Download
- First visit: ~500 KB
- Subsequent visits: ~50 KB (cached)

---

## 🎓 Understanding the Structure

### React App Structure
```
App.tsx (entry point)
  └── RouterProvider (routing)
      └── Layout (navigation & footer)
          └── Page Components
              └── UI Components
```

### File Naming Conventions
- **PascalCase:** Component files (`Home.tsx`, `Button.tsx`)
- **kebab-case:** Style files (`theme.css`, `fonts.css`)
- **camelCase:** Utility files (`utils.ts`)
- **UPPERCASE:** Documentation (`README.md`)

---

## ✅ Checklist: Do You Have Everything?

### Documentation
- [ ] START_HERE.md
- [ ] README.md
- [ ] DEPLOY_YOURSELF.md
- [ ] HANDOFF_CHECKLIST.md
- [ ] DEVELOPER_HANDOFF.md
- [ ] DEPLOY_TO_GOOGLE.md
- [ ] PROJECT_STRUCTURE.md

### Deployment
- [ ] deploy.sh
- [ ] deploy.bat
- [ ] firebase.json
- [ ] .firebaserc

### Source Code
- [ ] src/app/App.tsx
- [ ] src/app/routes.tsx
- [ ] src/app/pages/ (3 files)
- [ ] src/app/components/ (Layout + UI library)
- [ ] src/styles/ (4 files)

### Configuration
- [ ] package.json
- [ ] vite.config.ts
- [ ] postcss.config.mjs

**If you have all these, you're ready to deploy!** ✅

---

## 🎯 Next Steps

1. **Orient yourself:** Read `START_HERE.md`
2. **Choose your path:**
   - Deploy yourself → `DEPLOY_YOURSELF.md`
   - Give to developer → `HANDOFF_CHECKLIST.md`
3. **Get started!**

---

## 📞 Need to Find Something?

**Use your editor's search:**
- VS Code: `Ctrl + Shift + F` (Windows) or `Cmd + Shift + F` (Mac)
- Search for text across all files

**Common searches:**
- "Session Tiers" → Find pricing
- "Navigation" → Find menu
- "Aarambh" → Find session tier references
- "₹299" → Find pricing
- "No Per-Minute" → Find value proposition

---

**You now have a complete map of your project! 🗺️**

Go to `START_HERE.md` to begin your journey. 🚀
