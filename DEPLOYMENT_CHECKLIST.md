# ✅ DEPLOYMENT CHECKLIST

## **Follow these steps in order:**

---

## 🔧 **PREPARATION (5 minutes)**

### **1. Accounts Setup:**
- [ ] Create GitHub account (https://github.com/join)
- [ ] Create Vercel account (https://vercel.com - use GitHub login)
- [ ] Create Neon account (https://neon.tech - free database)

### **2. Database Setup:**
- [ ] Create new Neon project called "budget-tracker"
- [ ] Copy the connection string
- [ ] Save it somewhere safe

---

## 💻 **GIT SETUP (5 minutes)**

### **3. Open Git Bash:**
- [ ] Press Windows Key
- [ ] Type "Git Bash"
- [ ] Open it

### **4. Navigate to Project:**
```bash
cd /c/Users/umarj/Downloads/budget-tracker
```
- [ ] Run the command above

### **5. Initialize Git:**
```bash
git init
git add .
git commit -m "Initial commit - Budget Tracker"
```
- [ ] Run these commands one by one

---

## 🌐 **GITHUB SETUP (3 minutes)**

### **6. Create GitHub Repository:**
- [ ] Go to https://github.com/new
- [ ] Name: `budget-tracker`
- [ ] Public or Private (your choice)
- [ ] DON'T check "Initialize with README"
- [ ] Click "Create repository"
- [ ] Copy the repository URL

### **7. Push to GitHub:**
```bash
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```
- [ ] Replace YOUR_GITHUB_URL with your actual URL
- [ ] Run these commands

---

## 🚀 **VERCEL DEPLOYMENT (5 minutes)**

### **8. Import to Vercel:**
- [ ] Go to https://vercel.com/new
- [ ] Click "Import" next to your repository
- [ ] Click "Deploy"
- [ ] Wait for deployment (will fail - that's OK!)

### **9. Add Environment Variables:**
- [ ] Go to Settings → Environment Variables
- [ ] Add `DATABASE_URL` = your Neon connection string
- [ ] Add `NEXTAUTH_SECRET` = (from your .env file)
- [ ] Add `NEXTAUTH_URL` = https://your-app.vercel.app
- [ ] Add `GOOGLE_CLIENT_ID` = (from your .env file)
- [ ] Add `GOOGLE_CLIENT_SECRET` = (from your .env file)
- [ ] Add `APPLE_ID` = (from your .env file)
- [ ] Add `APPLE_SECRET` = (from your .env file)

### **10. Redeploy:**
- [ ] Click "Deployments" tab
- [ ] Click "..." menu on latest deployment
- [ ] Click "Redeploy"

---

## 🗄️ **DATABASE MIGRATION (3 minutes)**

### **11. Run Migrations:**

**In Git Bash:**
```bash
DATABASE_URL="your_neon_connection_string" npx prisma migrate deploy
```
- [ ] Replace with your actual Neon connection string
- [ ] Run the command

---

## 🔐 **OAUTH UPDATE (5 minutes)**

### **12. Update Google OAuth:**
- [ ] Go to https://console.cloud.google.com
- [ ] Select your project
- [ ] Go to Credentials
- [ ] Edit OAuth 2.0 Client
- [ ] Add to "Authorized redirect URIs":
  ```
  https://your-app.vercel.app/api/auth/callback/google
  ```
- [ ] Save

### **13. Update Apple OAuth:**
- [ ] Go to https://developer.apple.com
- [ ] Certificates, Identifiers & Profiles
- [ ] Edit your Service ID
- [ ] Add to "Return URLs":
  ```
  https://your-app.vercel.app/api/auth/callback/apple
  ```
- [ ] Save

---

## ✨ **TESTING (2 minutes)**

### **14. Test Your App:**
- [ ] Visit your Vercel URL
- [ ] Try to sign in
- [ ] Create a test transaction
- [ ] Check if everything works

### **15. Test on Mobile:**
- [ ] Open URL on your phone
- [ ] Tap menu → "Add to Home Screen"
- [ ] Open the installed app
- [ ] Test functionality

---

## 🎉 **DONE!**

Your app is now:
- ✅ Live on the internet
- ✅ Accessible worldwide
- ✅ Installable as mobile app
- ✅ Automatically deploys on Git push
- ✅ Free forever (on free tier)

---

## 📝 **Your App URLs:**

**Live App:**
```
https://your-app-name.vercel.app
```

**GitHub Repo:**
```
https://github.com/YOUR_USERNAME/budget-tracker
```

**Vercel Dashboard:**
```
https://vercel.com/YOUR_USERNAME/budget-tracker
```

---

## 🔄 **Future Updates:**

When you make changes:

```bash
# In Git Bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically deploy! 🚀

---

## 💡 **Tips:**

- Save your Vercel URL
- Bookmark your Vercel dashboard
- Keep your .env file safe
- Never commit .env to GitHub
- Test after each deployment

---

## 🆘 **If Something Goes Wrong:**

**Deployment Failed?**
- Check environment variables
- Check Vercel logs
- Make sure all env vars are added

**Can't Sign In?**
- Check OAuth redirect URLs
- Make sure NEXTAUTH_URL is correct
- Check database connection

**Database Error?**
- Make sure migrations ran
- Check DATABASE_URL is correct
- Check Neon database is running

---

**Need help? Let me know which step you're stuck on!** 🚀
