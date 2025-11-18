# 🚀 EcoQuest Foundation - Vercel Deployment Guide

Complete step-by-step guide to deploy your EcoQuest Foundation website to Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account (free - sign up at [vercel.com](https://vercel.com))
- Git installed on your computer (if deploying from local)

## ✅ What's Already Configured

Your website is **production-ready** with all necessary configurations:

✔️ **Next.js 14** with App Router
✔️ **Tailwind CSS** for styling
✔️ **Static Export** configured (`output: 'export'` in `next.config.js`)
✔️ **TypeScript** support
✔️ **Responsive Design** - mobile, tablet, and desktop
✔️ **SEO Optimized** - meta tags and semantic HTML

## 🌐 Deployment Methods

### Method 1: Deploy from GitHub (Recommended - Easiest)

This method enables **automatic deployments** whenever you push to GitHub.

#### Step 1: Push Code to GitHub

The code is already in your GitHub repository on branch `claude/build-ecoquest-website-01Rnaw8LwLnPi6EFJnKVHWC8`.

If you want to deploy from the main branch, merge this branch first:

```bash
# Switch to main branch
git checkout main

# Merge the feature branch
git merge claude/build-ecoquest-website-01Rnaw8LwLnPi6EFJnKVHWC8

# Push to GitHub
git push origin main
```

#### Step 2: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
   - If you don't have an account, click "Sign Up"
   - Choose "Continue with GitHub" for easiest integration

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - You'll see a list of your GitHub repositories
   - Find `ecoquest-foundation` and click "Import"

#### Step 3: Configure Project Settings

Vercel will auto-detect Next.js. You can use these settings:

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (leave as is)
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `out` (auto-filled for static export)
- **Install Command:** `npm install` (auto-filled)

**Environment Variables:** None required for basic deployment

Click **"Deploy"**

#### Step 4: Wait for Deployment

- Vercel will install dependencies (~30-60 seconds)
- Build your website (~1-2 minutes)
- Deploy to global CDN (~10 seconds)

#### Step 5: Access Your Live Website

Once complete, you'll see:
- ✅ **Production URL:** `https://ecoquest-foundation.vercel.app`
- 🔗 **Custom domain options** (optional)

### Method 2: Deploy from Vercel CLI

For developers who prefer command-line deployment.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Deploy

```bash
# From your project directory
cd /path/to/ecoquest-foundation

# Deploy to production
vercel --prod
```

The CLI will:
1. Detect Next.js project
2. Upload your code
3. Build the website
4. Deploy to Vercel
5. Provide your live URL

## 🎨 Post-Deployment Steps

### 1. Custom Domain (Optional)

To use `www.ecoquestfoundation.com`:

1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions
   - Add A record or CNAME record as instructed
   - Vercel handles SSL/HTTPS automatically

### 2. Environment Variables (If Needed Later)

For contact forms, analytics, etc.:

1. Go to **"Settings"** → **"Environment Variables"**
2. Add variables:
   - `NEXT_PUBLIC_GA_ID` - Google Analytics
   - `CONTACT_FORM_EMAIL` - Contact form endpoint
   - etc.

### 3. Configure Git Integration

Vercel automatically deploys when you push to your connected branch:

- **Production Branch:** `main` (or your chosen branch)
- **Preview Deployments:** All other branches get preview URLs
- **Pull Request Previews:** Automatic previews for PRs

## 🔄 Updating Your Website

### Automatic Updates (Recommended)

1. Make changes to your code locally
2. Commit changes:
   ```bash
   git add .
   git commit -m "Update content"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```
4. **Vercel automatically rebuilds and deploys!**

### Manual Updates via CLI

```bash
# Make your changes
# Then deploy
vercel --prod
```

## 🚨 Troubleshooting

### Build Fails

**Check Build Logs:**
1. Go to Vercel dashboard
2. Click on failed deployment
3. View **"Building"** logs
4. Look for error messages

**Common Fixes:**
- Ensure `package.json` has correct dependencies
- Check TypeScript errors: `npm run build` locally first
- Verify environment variables if using any

### Website Shows 404

- Check that `next.config.js` has `output: 'export'`
- Verify build completed successfully
- Clear browser cache

### Fonts Not Loading

Fonts load from Google Fonts CDN on the client side - they'll work once deployed to Vercel.

## 📊 Performance & Analytics

### Built-in Analytics

Vercel provides free analytics:
1. Go to project → **"Analytics"**
2. View real-time visitors, page views, performance

### Add Google Analytics (Optional)

1. Get GA4 Measurement ID
2. Add to `next.config.js` or use environment variable
3. Include Google Analytics script in `layout.tsx`

## 🔐 Security

Vercel automatically provides:
- ✅ **HTTPS/SSL** - Free and automatic
- ✅ **DDoS Protection**
- ✅ **Global CDN**
- ✅ **Auto-scaling**

## 💰 Pricing

**Hobby Plan (FREE):**
- Perfect for this project
- Unlimited deployments
- 100GB bandwidth/month
- Custom domains
- Auto HTTPS

**Pro Plan ($20/month):**
- Only needed for high-traffic sites
- 1TB bandwidth
- Advanced analytics
- Team collaboration

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Community:** https://github.com/vercel/next.js/discussions

## ✅ Deployment Checklist

- [x] Code built successfully locally (`npm run build`)
- [x] Code pushed to GitHub
- [x] Vercel account created
- [ ] Project imported to Vercel
- [ ] First deployment successful
- [ ] Website accessible at Vercel URL
- [ ] (Optional) Custom domain configured
- [ ] (Optional) Analytics set up

## 🎉 Success!

Once deployed, your website will be:
- 🌍 **Live globally** on Vercel's CDN
- ⚡ **Lightning fast** with edge caching
- 🔒 **Secure** with auto-HTTPS
- 📱 **Fully responsive** on all devices
- 🔄 **Auto-updating** with every git push

**Your live website will be at:**
`https://ecoquest-foundation.vercel.app`

Or your custom domain once configured.

---

**Need Help?**
Contact: info@ecoquestfoundation.org

**Built with:**
Next.js 14 + Tailwind CSS + TypeScript + React Icons
