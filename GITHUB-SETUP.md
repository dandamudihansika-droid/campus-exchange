# 🐙 GitHub Setup Guide for Campus Exchange

## 📋 Prerequisites

### 1. Install Git (if not already installed)
**Windows:**
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with default settings
3. Restart your command prompt/PowerShell

**Verify Installation:**
```bash
git --version
```

### 2. Create GitHub Account
1. Go to [github.com](https://github.com)
2. Click "Sign up" and create your account
3. Verify your email address

---

## 🚀 Step-by-Step GitHub Setup

### Step 1: Configure Git
Open Command Prompt or PowerShell and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: Initialize Repository
Navigate to your project folder:
```bash
cd "c:/Users/HANSIKA/Desktop/field project (2)/field project"
git init
```

### Step 3: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `campus-exchange`
3. **Description**: `Campus Exchange Platform - Buy and sell items within campus`
4. **Visibility**: Public (or Private if you prefer)
5. **Don't** initialize with README (we already have files)
6. Click "Create repository"

### Step 4: Connect Local to GitHub
Copy the repository URL from GitHub (it looks like: `https://github.com/YOUR_USERNAME/campus-exchange.git`)

Then run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/campus-exchange.git
git branch -M main
```

### Step 5: Add and Commit Files
```bash
git add .
git commit -m "Initial commit: Campus Exchange Platform with smart image mapping and Indian Rupee support"
```

### Step 6: Push to GitHub
```bash
git push -u origin main
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - 5 minutes)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `campus-exchange` repository
5. Settings:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
6. Click "Deploy"
7. Your site will be live at: `https://campus-exchange.vercel.app`

### Option 2: Netlify (5 minutes)
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: ./
6. Click "Deploy site"

### Option 3: GitHub Pages (10 minutes)
1. In your GitHub repository, go to "Settings" → "Pages"
2. Source: Deploy from a branch
3. Branch: `main` → `/ (root)`
4. Click "Save"
5. Your site will be live at: `https://YOUR_USERNAME.github.io/campus-exchange`

---

## 🔧 Important Updates for Deployment

### Update API Base URL for Production
In `js/api.js`, you may need to update:
```javascript
// For static deployment (Vercel/Netlify/GitHub Pages)
const API_BASE_URL = window.location.origin;

// If you deploy backend separately
// const API_BASE_URL = 'https://your-backend-server.com/api';
```

### Update Image Paths
Make sure all images use absolute paths in `data.js`:
```javascript
image: "/images/book.jpg"  // not "images/book.jpg"
```

---

## 📱 Quick Deploy Commands

### After making changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Vercel will automatically redeploy on each push!

---

## 🎯 Success Checklist

- [ ] Git installed and configured
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Deployment platform connected
- [ ] Site loads successfully
- [ ] All images display correctly
- [ ] Indian Rupee formatting works
- [ ] Search and filtering functional

---

## 🛠️ Troubleshooting

### Git Issues:
**"git is not recognized"** → Install Git from git-scm.com

**"Permission denied"** → Check your GitHub credentials

### Deployment Issues:
**Images not loading** → Check image paths are absolute (start with /)

**API calls failing** → Update API_BASE_URL in js/api.js

**404 errors** → Ensure repository name matches deployment settings

---

## 📞 Next Steps

1. **Deploy your site** using one of the options above
2. **Test all features** on the live site
3. **Share your site** with others
4. **Consider adding**:
   - Custom domain
   - Analytics (Google Analytics)
   - Error monitoring
   - Contact form

---

**🎉 Congratulations! Your Campus Exchange is now ready for deployment!**

**Need help?** Check the full deployment guide in `README-DEPLOYMENT.md`
