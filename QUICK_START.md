# 🚀 Quick Start Guide - Budget Planner

## ✅ **What Works Right Now (No Setup Required)**

### **Email/Password Authentication** 
This is **fully functional** and ready to use immediately!

1. Go to: `http://localhost:3002`
2. Click "Get Started Free" or "Login"
3. Click "Sign up" 
4. Fill in:
   - Name: Your name
   - Email: Any email (e.g., test@example.com)
   - Password: At least 6 characters
5. Click "Sign up"
6. Login with your credentials
7. **Start using the app!**

---

## 🔐 **Authentication Options**

### ✅ **Email/Password** (Ready Now)
- **Status**: Fully working
- **Setup**: None required
- **How to use**: Just sign up and login!

### ⚠️ **Google OAuth** (Requires Setup)
- **Status**: Needs Google Cloud credentials
- **Error**: "Auth error" when clicking the button
- **How to fix**: Follow `GOOGLE_OAUTH_SETUP.md`
- **Time**: ~10 minutes to set up

### ❌ **Apple OAuth** (Disabled)
- **Status**: Requires Apple Developer account ($99/year)
- **Note**: Temporarily disabled until you get credentials

---

## 📝 **Recommended: Start with Email/Password**

The **easiest way** to start using the app right now:

1. **Sign Up**:
   ```
   http://localhost:3002/signup
   ```
   - Name: John Doe
   - Email: john@example.com
   - Password: password123

2. **Login**:
   ```
   http://localhost:3002/login
   ```
   - Use the credentials you just created

3. **Start Using**:
   - Add transactions
   - Create categories
   - Set savings goals
   - Import CSV files
   - Everything works!

---

## 🎯 **All Features Available with Email/Password**

Once logged in with email/password, you have **full access** to:

✅ Dashboard with charts  
✅ Add/Edit/Delete transactions  
✅ Multi-currency support  
✅ Category management  
✅ Split transactions  
✅ CSV import  
✅ Smart category suggestions  
✅ Deep filtering  
✅ Transaction tags  
✅ Recurring transactions  
✅ Savings goals  
✅ Subscription tracking  
✅ Cash flow calendar  
✅ Change password  
✅ Dark mode  

**No OAuth needed for any of these features!**

---

## 🔧 **Optional: Set Up Google OAuth Later**

If you want to enable "Continue with Google":

1. **Read**: `GOOGLE_OAUTH_SETUP.md`
2. **Follow** the step-by-step guide
3. **Add** credentials to `.env` file
4. **Restart** the dev server
5. **Test** the Google button

**But this is completely optional!** The app works perfectly with email/password.

---

## ❓ **FAQ**

**Q: Why does Google/Apple show an error?**  
A: They need API credentials from Google Cloud Console / Apple Developer Portal. Email/password works without any setup.

**Q: Can I use all features without OAuth?**  
A: Yes! Email/password gives you 100% of the features.

**Q: How do I test the app quickly?**  
A: Just sign up with any email and password. No verification needed for local development.

**Q: Is my data safe?**  
A: Yes! Passwords are hashed with bcrypt, and all data is isolated per user.

---

## 🎉 **Ready to Go!**

Visit: `http://localhost:3002`  
Click: "Sign up"  
Start: Managing your finances!

**No OAuth setup required to use the full app!** 🚀
