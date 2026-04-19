# 🚀 Campus Exchange - Deployment Guide

## 📋 Table of Contents
1. [GitHub Setup](#github-setup)
2. [Deployment Options](#deployment-options)
3. [Vercel Deployment (Recommended)](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [GitHub Pages Deployment](#github-pages-deployment)
6. [Custom Server Deployment](#custom-server-deployment)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

---

## 🐙 GitHub Setup

### 1. Create GitHub Repository
```bash
# If you don't have Git installed, install it first
# Then initialize your repository
git init
git add .
git commit -m "Initial commit: Campus Exchange Platform"

# Create a new repository on GitHub: https://github.com/new
# Then connect your local repository
git remote add origin https://github.com/YOUR_USERNAME/campus-exchange.git
git branch -M main
git push -u origin main
```

### 2. Create .gitignore File
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Temporary files
tmp/
temp/
```

### 3. Repository Structure
```
campus-exchange/
├── index.html
├── items.html
├── item_details.html
├── categories.html
├── sell.html
├── login.html
├── signup.html
├── css/
│   └── style.css
├── js/
│   └── api.js
├── images/
│   ├── book.jpg
│   ├── headphones.jpg
│   └── ... (all product images)
├── data.js
├── package.json
├── server.js
└── README.md
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐
- **Pros**: Free, easy GitHub integration, automatic deployments
- **Best for**: Frontend + API deployment
- **Time**: 5 minutes

### Option 2: Netlify
- **Pros**: Free, forms handling, GitHub integration
- **Best for**: Static frontend deployment
- **Time**: 5 minutes

### Option 3: GitHub Pages
- **Pros**: Free, GitHub native
- **Best for**: Static sites only
- **Time**: 10 minutes

### Option 4: Custom Server
- **Pros**: Full control, custom domain
- **Best for**: Production with backend
- **Time**: 30+ minutes

---

## ⚡ Vercel Deployment (Recommended)

### Step 1: Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Install Vercel CLI (optional):
```bash
npm i -g vercel
```

### Step 2: Deploy Your Project
#### Method A: Automatic (via GitHub)
1. Click "New Project" in Vercel dashboard
2. Import your GitHub repository
3. Configure settings:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: (leave empty for static)
   - **Output Directory**: public (leave empty)
4. Click "Deploy"

#### Method B: Manual (via CLI)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod

# Follow the prompts
# Your site will be live at: https://your-app.vercel.app
```

### Step 3: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to Project Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Step 4: Automatic Deployments
- Every push to `main` branch auto-deploys
- Pull requests create preview deployments
- Configure branch protection in GitHub if needed

---

## 🔥 Netlify Deployment

### Step 1: Sign Up for Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### Step 2: Deploy
1. Click "New site from Git"
2. Choose your GitHub repository
3. Build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: ./
4. Click "Deploy site"

### Step 3: Custom Domain
- Go to Site settings → Domain management
- Add custom domain

---

## 📄 GitHub Pages Deployment

### Step 1: Configure Repository
1. Go to your GitHub repository
2. Click "Settings" → "Pages"
3. Source: Deploy from a branch
4. Branch: `main` → `/ (root)`
5. Click Save

### Step 2: Update API Base URL
In `js/api.js`, update the API base URL:
```javascript
// For GitHub Pages, use relative paths
const API_BASE_URL = window.location.origin;
```

### Step 3: Deploy
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Your site will be available at: `https://YOUR_USERNAME.github.io/campus-exchange`

---

## 🖥️ Custom Server Deployment

### Option A: VPS (DigitalOcean, AWS, etc.)
```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone your repository
git clone https://github.com/YOUR_USERNAME/campus-exchange.git
cd campus-exchange

# 4. Install dependencies
npm install

# 5. Install PM2 for process management
npm install -g pm2

# 6. Start the server
pm2 start server.js --name "campus-exchange"
pm2 save
pm2 startup

# 7. Configure firewall
sudo ufw allow 3000
sudo ufw allow 80
sudo ufw allow 443
```

### Option B: Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Deploy:
```bash
docker-compose up -d
```

---

## 🔧 Environment Variables

### Create `.env` file (for backend deployment):
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/campus-exchange
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://yourdomain.com
```

### For Frontend (Vercel/Netlify):
In deployment settings, add:
```
API_BASE_URL=https://your-backend-url.com/api
```

---

## 🛠️ Troubleshooting

### Common Issues:

#### 1. Images Not Loading
```javascript
// Ensure all image paths are correct
// Use absolute paths for production
image: "/images/book.jpg"  // not "images/book.jpg"
```

#### 2. API Calls Failing
```javascript
// Update API base URL for production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:3000/api';
```

#### 3. CORS Errors
Add this to your `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-domain.com', 'https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

#### 4. Build Errors
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Deployment Checklist:
- [ ] Repository pushed to GitHub
- [ ] All images committed and paths correct
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] HTTPS certificate active
- [ ] Custom domain configured (if needed)
- [ ] Error monitoring set up

---

## 📞 Support & Monitoring

### Add Error Monitoring (Optional):
```javascript
// Add to your main JS files
window.addEventListener('error', (e) => {
  console.error('Application Error:', e.error);
  // Send to error monitoring service
});
```

### Performance Monitoring:
- Use Vercel Analytics
- Google PageSpeed Insights
- GTmetrix for performance testing

---

## 🎉 Success Metrics

Your Campus Exchange is successfully deployed when:
✅ Homepage loads at your custom domain  
✅ All product images display correctly  
✅ Indian Rupee prices show properly  
✅ Search and filtering work  
✅ Item details pages load  
✅ Mobile responsive design works  
✅ No console errors  

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Happy Deploying! 🚀**
