# Deploy Celestials to Google Cloud Platform

## 🎯 Quick Google Deployment Guide

This guide covers the easiest and fastest ways to deploy your Celestials app on Google's infrastructure.

---

## Option 1: Firebase Hosting (⭐ RECOMMENDED - Easiest)

Firebase Hosting is Google's static site hosting solution - perfect for React apps.

### Why Firebase Hosting?
- ✅ **Free SSL certificate** (automatic HTTPS)
- ✅ **Global CDN** (fast worldwide)
- ✅ **Free tier** (generous limits)
- ✅ **Easy setup** (under 5 minutes)
- ✅ **Custom domain** support
- ✅ **Automatic deployments**

### Step-by-Step Deployment

#### 1. Prerequisites
```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install Firebase CLI globally
npm install -g firebase-tools
```

#### 2. Login to Firebase
```bash
firebase login
```
This will open a browser window - sign in with your Google account.

#### 3. Initialize Firebase in Your Project
```bash
# Navigate to your project directory
cd celestials-app

# Initialize Firebase
firebase init hosting
```

**Answer the prompts:**
- **"What do you want to use as your public directory?"** → Type: `dist`
- **"Configure as a single-page app?"** → Type: `y` (yes)
- **"Set up automatic builds and deploys with GitHub?"** → Type: `n` (no, for now)
- **"File dist/index.html already exists. Overwrite?"** → Type: `N` (no)

#### 4. Build Your App
```bash
npm run build
# OR
pnpm build
```

This creates the `dist` folder with your production-ready files.

#### 5. Deploy to Firebase
```bash
firebase deploy --only hosting
```

#### 6. Your App is Live! 🎉
Firebase will give you a URL like:
```
https://your-project-name.web.app
https://your-project-name.firebaseapp.com
```

### Adding a Custom Domain (e.g., celestials.in)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Hosting** in the left menu
4. Click **Add custom domain**
5. Follow the instructions to:
   - Add your domain (e.g., `www.celestials.in`)
   - Add the DNS records to your domain registrar
   - Wait for SSL certificate provisioning (24-48 hours)

---

## Option 2: Google Cloud Run (For Advanced Users)

If you need server-side functionality or want more control.

### Step 1: Create a Dockerfile

Create a file named `Dockerfile` in your project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Add nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Deploy to Cloud Run

```bash
# Install Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR-PROJECT-ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Build and deploy in one command
gcloud run deploy celestials \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

You'll get a URL like: `https://celestials-xxxxx-as.a.run.app`

---

## Option 3: Cloud Storage + Load Balancer (Enterprise Setup)

For high-traffic production apps with custom domains.

### Quick Setup

```bash
# Create a bucket
gsutil mb gs://celestials-app

# Make it public
gsutil iam ch allUsers:objectViewer gs://celestials-app

# Build your app
npm run build

# Upload files
gsutil -m cp -r dist/* gs://celestials-app

# Set up for web serving
gsutil web set -m index.html -e index.html gs://celestials-app
```

Your app will be available at:
```
https://storage.googleapis.com/celestials-app/index.html
```

For a custom domain, you'll need to set up a Load Balancer (more complex).

---

## Comparison: Which Option to Choose?

| Feature | Firebase Hosting | Cloud Run | Cloud Storage |
|---------|-----------------|-----------|---------------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ Easiest | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Easy |
| **Cost (Low Traffic)** | Free | ~$0-5/month | ~$1-3/month |
| **SSL Certificate** | Auto (Free) | Auto (Free) | Manual setup |
| **Custom Domain** | Easy | Easy | Complex |
| **CDN** | Built-in | Optional | Requires setup |
| **Backend Support** | No | Yes | No |
| **Best For** | Most cases | Full-stack apps | Simple sites |

**Recommendation:** Start with **Firebase Hosting** ⭐

---

## Post-Deployment Checklist

After deploying, make sure to:

### 1. Test Your Live Site
- [ ] Visit your deployment URL
- [ ] Test all page routes (/, /features, /how-it-works)
- [ ] Check mobile responsiveness
- [ ] Verify images and assets load correctly
- [ ] Test navigation between pages

### 2. Set Up Analytics
```bash
# Add Google Analytics to your app
# In your HTML or React component
```

Add to `/src/app/App.tsx`:
```typescript
useEffect(() => {
  // Google Analytics
  window.gtag('config', 'YOUR-GA-ID');
}, []);
```

### 3. Set Up Monitoring
- Enable Firebase Performance Monitoring
- Set up Uptime checks in Google Cloud Console
- Configure error tracking (Sentry, LogRocket, etc.)

### 4. Security Headers

For Firebase, create `firebase.json` with security headers:
```json
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

### 5. Performance Optimization
- [ ] Enable compression (automatic on Firebase/Cloud Run)
- [ ] Set cache headers for static assets
- [ ] Optimize images (use WebP format)
- [ ] Enable HTTP/2 (automatic on Firebase/Cloud Run)

---

## Continuous Deployment with GitHub (Optional)

### Set Up Auto-Deploy from GitHub

1. Push your code to GitHub
2. In Firebase Console:
   - Go to Hosting
   - Click "Set up GitHub integration"
   - Authorize Firebase
   - Select your repository
   - Choose branch (e.g., `main`)

Now every push to `main` automatically deploys!

---

## Cost Estimation (Firebase Hosting)

### Free Tier (Spark Plan)
- 10 GB storage
- 360 MB/day data transfer
- Perfect for getting started!

### Paid Tier (Blaze Plan - Pay as you go)
Example for moderate traffic:
- **Storage:** 1 GB = $0.026/month
- **Data Transfer:** 10 GB = $0.15/month
- **Estimated:** ~$5-10/month for small business

---

## Troubleshooting

### Issue: "404 on page refresh"
**Solution:** Make sure your `firebase.json` has the rewrite rule:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Issue: "Build failed"
**Solution:** Clear cache and rebuild:
```bash
rm -rf dist node_modules
npm install
npm run build
firebase deploy
```

### Issue: "Images not loading"
**Solution:** Check that image imports use correct paths in your components.

---

## Support Resources

- **Firebase Docs:** https://firebase.google.com/docs/hosting
- **Cloud Run Docs:** https://cloud.google.com/run/docs
- **Google Cloud Console:** https://console.cloud.google.com
- **Firebase Console:** https://console.firebase.google.com

---

## Quick Command Reference

```bash
# Firebase Hosting Commands
firebase login                    # Login to Firebase
firebase init hosting            # Initialize project
firebase deploy --only hosting   # Deploy to Firebase
firebase open hosting:site       # Open live site
firebase serve                   # Test locally before deploy

# Cloud Run Commands
gcloud auth login                # Login to Google Cloud
gcloud run deploy                # Deploy to Cloud Run
gcloud run services list         # List deployed services
gcloud run services delete NAME  # Delete a service

# Build Commands
npm install                      # Install dependencies
npm run build                    # Build for production
npm run dev                      # Run locally
```

---

## Next Steps After Deployment

1. **Share the link** with your team/stakeholders
2. **Set up custom domain** (celestials.in)
3. **Integrate backend APIs** (when ready)
4. **Add analytics tracking**
5. **Configure environment variables** for production
6. **Set up error monitoring**
7. **Plan for backend integration**

---

**🎉 Congratulations! Your Celestials app is now live on Google Cloud!**

For backend integration, refer to `DEVELOPER_HANDOFF.md` for API integration points.
