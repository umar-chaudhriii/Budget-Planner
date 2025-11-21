# 💰 Budget Planner

> **The smart, beautiful way to track expenses, plan budgets, and achieve your financial goals.**

A professional-grade financial management application built with Next.js 14, featuring an iOS-inspired design, advanced budgeting tools, and comprehensive authentication.

![Budget Planner](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 🔐 **Authentication & Security**
- Email/Password authentication with bcrypt hashing
- Google OAuth integration
- Apple OAuth integration (ready)
- Password reset via email tokens
- Change password in settings
- Session management with NextAuth.js
- Data isolation per user

### 💸 **Core Financial Features**
- **Transaction Management**: Add, edit, delete, and categorize transactions
- **Multi-Currency Support**: 7+ currencies (USD, EUR, GBP, JPY, INR, CAD, AUD)
- **Category System**: Custom categories for income and expenses
- **Dashboard**: Real-time financial overview with charts
- **Monthly Aggregation**: Historical data for the last 6 months

### 🚀 **Advanced Features**
- **Split Transactions**: Divide one transaction into multiple entries
- **CSV Bulk Import**: Import bank statements with auto-category creation
- **Smart Category Suggestions**: AI-powered suggestions based on description
- **Deep Filtering**: Filter by type, category, amount range, and search
- **Transaction Tags**: Organize with custom tags
- **Recurring Transactions**: Mark and track recurring expenses
- **Savings Goals**: Set targets and track progress
- **Subscription Tracking**: Monitor recurring subscriptions
- **Cash Flow Calendar**: Visual calendar view of transactions

### 🎨 **Design & UX**
- **iOS-Style Interface**: Clean, modern, Apple-inspired design
- **Dark Mode**: Full dark mode support with system detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Fade-ins, transitions, and hover effects
- **Professional Landing Page**: Engaging hero section with feature highlights
- **Password Visibility Toggles**: Eye icons on all password fields

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd budget-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
budget-tracker/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── transactions/ # Transaction CRUD
│   │   ├── categories/   # Category management
│   │   └── user/         # User settings
│   ├── components/       # Reusable components
│   ├── transactions/     # Transaction pages
│   ├── categories/       # Category management
│   ├── goals/            # Savings goals
│   ├── subscriptions/    # Subscription tracking
│   ├── calendar/         # Cash flow calendar
│   ├── settings/         # User settings
│   ├── landing/          # Landing page
│   └── layout.tsx        # Root layout
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/
│   ├── logo.svg          # App logo
│   └── icon.svg          # App icon
└── hooks/
    └── useUserCurrency.ts # Currency hook
```

---

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`

### Apple OAuth Setup (Optional)
1. Enroll in [Apple Developer Program](https://developer.apple.com/)
2. Create a Service ID
3. Generate a Client Secret
4. Add to `.env`:
```env
APPLE_ID="your-apple-service-id"
APPLE_SECRET="your-apple-client-secret"
```

### Email Service (Optional)
For password reset emails:
```bash
npm install resend
```

Add to `.env`:
```env
RESEND_API_KEY="your-resend-api-key"
```

Update `/app/api/auth/forgot-password/route.ts` to send emails instead of console logging.

---

## 📊 Database Schema

The app uses Prisma ORM with SQLite (development) or PostgreSQL (production).

**Main Models:**
- `User` - User accounts with authentication
- `Category` - Income/Expense categories
- `Transaction` - Financial transactions with tags and recurring flag
- `Goal` - Savings goals with target amounts
- `Subscription` - Recurring subscription tracking

Run migrations:
```bash
npx prisma migrate dev
```

View database:
```bash
npx prisma studio
```

---

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: next-themes
- **CSV Parsing**: PapaParse

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

---

## 🌟 Key Features Walkthrough

### 1. **Smart Category Suggestions**
When adding a transaction, start typing the description. The app will suggest a category based on your previous transactions with similar descriptions.

### 2. **Split Transactions**
Click the split icon next to any transaction to divide it into multiple entries. Perfect for shared expenses or itemized receipts.

### 3. **CSV Import**
Import your bank statements in CSV format. The app will:
- Parse the file
- Show a preview
- Auto-create missing categories
- Bulk insert transactions

### 4. **Deep Filtering**
Use the filter dropdown to search by:
- Transaction type (Income/Expense)
- Category
- Description keywords
- Amount range

### 5. **Cash Flow Calendar**
View your transactions in a calendar format. Navigate between months to see your financial history visually.

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables
- Deploy!

3. **Set up Production Database**
- Use Vercel Postgres or external PostgreSQL
- Update `DATABASE_URL` in Vercel environment variables
- Run `npx prisma migrate deploy`

---

## 📖 Documentation

- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Implementation summary
- **[.env.example](./.env.example)** - Environment variables template

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Design inspired by iOS and Apple's Human Interface Guidelines
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Made with ❤️ using Next.js and TypeScript**
