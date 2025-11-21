# 🚀 DEPLOYMENT GUIDE - Using Git Bash

## **You already have Git! Let's deploy!**

---

## 📋 **Step-by-Step Instructions:**

### **Step 1: Open Git Bash**

1. Press `Windows Key`
2. Type **"Git Bash"**
3. Click to open it
4. You'll see a terminal window

---

### **Step 2: Navigate to Your Project**

In Git Bash, type:

```bash
cd /c/Users/umarj/Downloads/budget-tracker
```

Press Enter.

---

### **Step 3: Initialize Git**

Copy and paste these commands one by one:

```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Budget Tracker"
```

---

### **Step 4: Create GitHub Repository**

1. **Go to:** https://github.com/new
2. **Repository name:** `budget-tracker`
3. **Keep it:** Public (or Private, your choice)
4. **DON'T** check "Initialize with README"
5. **Click:** "Create repository"

---

### **Step 5: Push to GitHub**

After creating the repo, GitHub will show you commands. Use these in Git Bash:

```bash
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/budget-tracker.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
If your GitHub username is `john`, the URL would be:
```
https://github.com/john/budget-tracker.git
```

---

### **Step 6: Deploy to Vercel**

1. **Go to:** https://vercel.com
2. **Sign up/Login** (use GitHub - it's easier!)
3. **Click:** "Add New" → "Project"
4. **Click:** "Import" next to your `budget-tracker` repository
5. **Vercel auto-detects Next.js** - just click "Deploy"!

---

### **Step 7: Add Environment Variables**

After deployment (it will fail first time - that's OK!):

1. Go to your project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add these one by one:

```
DATABASE_URL = your_neon_connection_string
NEXTAUTH_SECRET = your_secret_from_.env
NEXTAUTH_URL = https://your-app.vercel.app
GOOGLE_CLIENT_ID = your_google_id
GOOGLE_CLIENT_SECRET = your_google_secret
APPLE_ID = your_apple_id
APPLE_SECRET = your_apple_secret
```

4. **Click:** "Redeploy" → "Redeploy"

---

### **Step 8: Setup Database**

You need to run migrations on your production database:

**Option A: Use Vercel CLI** (if installed)
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

**Option B: Use Neon Console**
1. Go to your Neon dashboard
2. Open SQL Editor
3. Copy the schema from `prisma/schema.prisma`
4. Run the migration

**Option C: Local migration to production DB**
```bash
# In Git Bash, temporarily use production DB
DATABASE_URL="your_neon_connection_string" npx prisma migrate deploy
```

---

### **Step 9: Update OAuth URLs**

#### **Google Console:**
1. Go to: https://console.cloud.google.com
2. Go to "Credentials"
3. Edit your OAuth client
4. Add to "Authorized redirect URIs":
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

#### **Apple Developer:**
1. Go to: https://developer.apple.com
2. Edit your Service ID
3. Add to "Return URLs":
   ```
   https://your-app.vercel.app/api/auth/callback/apple
   ```

---

## ✅ **Checklist:**

- [ ] Open Git Bash
- [ ] Navigate to project folder
- [ ] Initialize Git (`git init`)
- [ ] Add files (`git add .`)
- [ ] Commit (`git commit -m "Initial commit"`)
- [ ] Create GitHub repository
- [ ] Push to GitHub
- [ ] Sign up for Vercel
- [ ] Import GitHub repo to Vercel
- [ ] Add environment variables
- [ ] Redeploy
- [ ] Run database migrations
- [ ] Update OAuth URLs
- [ ] Test your live app!

---

## 🎯 **Quick Commands Reference:**

### **In Git Bash:**

```bash
# Navigate to project
cd /c/Users/umarj/Downloads/budget-tracker

# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub (after creating repo)
git remote add origin https://github.com/YOUR_USERNAME/budget-tracker.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Update"
git push
```

---

## 💡 **Tips:**

- **First deployment will fail** - that's normal! Add env variables and redeploy.
- **Use GitHub login for Vercel** - it's easier to connect repos
- **Keep your .env file safe** - never commit it to GitHub
- **Vercel auto-deploys** - every time you push to GitHub, it deploys automatically!

---

## 🆘 **Need Help?**

If you get stuck at any step, let me know:
- Which step you're on
- What error you see (if any)
- Screenshot if helpful

I'll help you through it! 🚀

---

## 🎉 **After Deployment:**

Your app will be live at:
```
https://your-app-name.vercel.app
```

Users can:
1. Visit the URL
2. Click "Add to Home Screen" on mobile
3. Use it like a native app!

---

**Ready? Start with Step 1 - Open Git Bash!** 🚀
