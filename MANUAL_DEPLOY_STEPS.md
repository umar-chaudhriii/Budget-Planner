# 🚀 MANUAL DEPLOYMENT STEPS (While CLI Installs)

## **You can do this in parallel!**

---

## 📝 **Step 1: Create Vercel Account**

### **Do this now:**

1. **Go to:** https://vercel.com
2. **Click:** "Sign Up"
3. **Choose:** Sign up with Email or GitHub
4. **Verify** your email
5. **Done!** Keep the browser tab open

---

## 💾 **Step 2: Create Free Database**

### **Do this now:**

1. **Go to:** https://neon.tech
2. **Click:** "Sign Up" (use GitHub or Email)
3. **Click:** "Create a project"
4. **Name it:** `budget-tracker`
5. **Region:** Choose closest to you
6. **Click:** "Create Project"

### **Copy Connection String:**

After creation, you'll see a connection string like:
```
postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

**IMPORTANT:** Copy this! We'll need it.

---

## 🔧 **Step 3: Prepare Environment Variables**

### **Open your `.env` file and copy these values:**

You'll need:
- `DATABASE_URL` (the Neon connection string from above)
- `NEXTAUTH_SECRET` (from your .env)
- `NEXTAUTH_URL` (we'll update this after deployment)
- `GOOGLE_CLIENT_ID` (from your .env)
- `GOOGLE_CLIENT_SECRET` (from your .env)
- `APPLE_ID` (from your .env)
- `APPLE_SECRET` (from your .env)

**Keep these ready!**

---

## 🌐 **Step 4: Deploy via Vercel Dashboard**

### **After Vercel CLI installs, we'll use it. OR you can do this manually:**

1. **Go to:** https://vercel.com/new
2. **Click:** "Continue with Email" or "Continue with GitHub"
3. **Choose:** "Import Project"

### **But wait! We need Git first...**

---

## 🔄 **Alternative: Install Git First**

Since Git is not installed, let's install it:

### **Download Git:**
1. **Go to:** https://git-scm.com/download/win
2. **Download** the installer
3. **Run it** and click "Next" through all steps
4. **Restart** your terminal

### **After Git is installed:**

```bash
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repo (go to github.com/new)
# Then:
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

---

## ⚡ **Fastest Option: Vercel CLI (What we're doing)**

Once the CLI finishes installing, we'll run:

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... etc

# Deploy to production
vercel --prod
```

---

## 📊 **Current Progress:**

- [x] Started Vercel CLI installation
- [ ] Vercel CLI installed
- [ ] Login to Vercel
- [ ] Deploy project
- [ ] Add environment variables
- [ ] Setup database
- [ ] Update OAuth URLs
- [ ] Test deployment

---

## ⏰ **What to Do While Waiting:**

1. ✅ Create Vercel account (https://vercel.com)
2. ✅ Create Neon database (https://neon.tech)
3. ✅ Copy your connection string
4. ✅ Have your .env values ready

**This will save time when the CLI is ready!**

---

## 🎯 **Next Steps:**

Once Vercel CLI finishes installing, I'll help you:
1. Login to Vercel
2. Deploy your app
3. Add environment variables
4. Run database migrations
5. Test your live app!

---

**Installing... Please wait or start creating accounts above!** ⏳
