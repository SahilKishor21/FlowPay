# B2B Payment Management System

A comprehensive web application for managing cheque and cash payments for AEC (Architecture, Engineering, and Construction) businesses.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)

---

## 🎯 Overview

This system helps AEC businesses manage offline payments (cheques and cash) which account for approximately 50% of B2B payment volumes. It provides real-time tracking, status management, analytics, and automated calculations.

**Key Problems Solved:**
- Manual tracking of Post-Dated Cheques (PDCs)
- Delayed payment cycles
- Bounced cheque management
- Cash transaction recording
- Payment reconciliation

---

## ✨ Features

### Dashboard
- Real-time payment statistics
- Total outstanding amount tracking
- Pending cheques count
- Monthly cleared payments
- Bounce rate calculation
- Live backend connection status

### Cheque Management
- Add new cheques with client details
- Track cheque status (Pending, Post-Dated, Cleared, Bounced)
- Update cheque status with bounce reason
- View complete cheque details
- Download HTML receipts
- Print PDF receipts
- Client-wise cheque tracking
- Bank-wise categorization

### Cash Management
- Record cash transactions
- Digital receipt generation
- Verification status tracking
- Bank deposit monitoring
- Downloadable receipts

### Analytics & Insights
- Upcoming payments (next 30 days)
- Recent activity tracking (last 5 transactions)
- Key metrics dashboard
- Real-time calculations
- Color-coded status indicators

### UI/UX Features
- Modern gradient-based design
- Dark/Light theme support
- Fully responsive (mobile, tablet, desktop)
- Glassmorphism effects
- Smooth animations
- Toast notifications
- Loading states

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.5 | React framework with App Router |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.4.4 | Styling |
| Shadcn/ui | Latest | UI components |
| Zustand | 4.5.2 | State management |
| Axios | 1.7.2 | API calls |
| Recharts | 2.12.7 | Charts |
| Lucide React | 0.396.0 | Icons |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.x | Runtime |
| Express.js | 4.18.2 | Web framework |
| MongoDB | Latest | Database |
| Mongoose | 8.3.2 | ODM |
| CORS | 2.8.5 | Cross-origin requests |
| Dotenv | 16.4.5 | Environment variables |

---

## 📁 Project Structure

```
payment-management-system/
│
├── frontend/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── toaster.tsx
│   │   │
│   │   ├── add-payment-dialog.tsx
│   │   ├── analytics.tsx
│   │   ├── cash-list.tsx
│   │   ├── cheque-list.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── payment-calendar.tsx
│   │   ├── payment-tabs.tsx
│   │   ├── recent-transactions.tsx
│   │   ├── stats-cards.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── hooks/
│   │   └── use-toast.ts
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   │
│   ├── store/
│   │   └── payment-store.ts
│   │
│   ├── .env.local
│   ├── next.config.mjs
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docs/
│   └── Solutions.md
│
├── backend/
│   ├── models/
│   │   ├── Cash.model.js
│   │   └── Cheque.model.js
│   │
│   ├── routes/
│   │   ├── analytics.routes.js
│   │   ├── cash.routes.js
│   │   ├── cheque.routes.js
│   │   └── payment.routes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Step 1: Clone the Repository

```bash
git clone <https://github.com/SahilKishor21/FlowPay>
cd payment-management-system
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

---

## ⚙️ Configuration

### Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Configuration

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/payment-management
NODE_ENV=development
```

**For MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/payment-management?retryWrites=true&w=majority
```

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

Server will run on: `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Application will run on: `http://localhost:3000`

### Verify Backend Connection

Visit: `http://localhost:5000/api/health`

Should return:
```json
{
  "status": "OK",
  "database": "Connected"
}
```

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

### Cheque Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cheques` | Get all cheques |
| GET | `/cheques/:id` | Get cheque by ID |
| POST | `/cheques` | Create new cheque |
| PUT | `/cheques/:id` | Update cheque |
| PATCH | `/cheques/:id/status` | Update cheque status |
| DELETE | `/cheques/:id` | Delete cheque |

### Cash Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cash` | Get all cash transactions |
| GET | `/cash/:id` | Get transaction by ID |
| POST | `/cash` | Create new transaction |
| PUT | `/cash/:id` | Update transaction |
| PATCH | `/cash/:id/verify` | Verify transaction |
| DELETE | `/cash/:id` | Delete transaction |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payments/dashboard` | Get dashboard statistics |
| GET | `/payments/upcoming` | Get upcoming payments |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check server health |

---

## 🗄️ Database Schema

### Cheque Collection

```javascript
{
  clientName: String,
  chequeNumber: String,
  bankName: String,
  amount: Number,
  dueDate: Date,
  status: String, // 'Pending', 'Cleared', 'Bounced', 'Post-Dated'
  createdAt: Date,
  updatedAt: Date
}
```

### Cash Collection

```javascript
{
  clientName: String,
  receiptNumber: String,
  amount: Number,
  date: Date,
  verified: Boolean,
  verifiedBy: String,
  depositedToBank: Boolean,
  bankDepositDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📱 Usage

### Adding a Cheque Payment

1. Click "Add Payment" button
2. Select "Cheque" as payment type
3. Fill in:
   - Client Name
   - Cheque Number
   - Bank Name
   - Due Date
   - Amount
   - Status (Pending/Post-Dated/Cleared/Bounced)
4. Click "Add Payment"

### Updating Cheque Status

1. Find the cheque in the list
2. Click "Status" button
3. Select new status from dropdown
4. If "Bounced", enter bounce reason
5. Click "Update Status"

### Adding Cash Payment

1. Click "Add Payment" button
2. Select "Cash" as payment type
3. Fill in:
   - Client Name
   - Receipt Number
   - Date
   - Amount
4. Click "Add Payment"

### Viewing Payment Details

1. Click "View" button on any payment
2. View complete details in the dialog
3. Download HTML receipt or print PDF

---

## 🎨 Features in Detail

### Dashboard Statistics

Automatically calculates:
- **Total Outstanding**: Sum of all pending/post-dated cheques
- **Pending Cheques**: Count of pending and post-dated cheques
- **Cleared This Month**: Total amount cleared in current month
- **Bounce Rate**: (Bounced cheques / Total processed) × 100

### Status Color Coding

- 🟡 **Pending**: Yellow badge
- 🔵 **Post-Dated**: Blue badge
- 🟢 **Cleared**: Green badge
- 🔴 **Bounced**: Red badge

### Receipt Generation

Each payment can be downloaded as:
- **HTML Receipt**: Printable HTML file with company branding
- **PDF**: Open printable version and use browser's "Save as PDF"

Receipts include:
- Payment details
- Client information
- Transaction ID
- Amount in large format
- Company information
- Signature sections

---

## 🐛 Troubleshooting

### Backend not connecting

1. Check if backend is running on port 5000
2. Verify MongoDB connection string in `.env`
3. Ensure MongoDB is running (if local)
4. Check firewall/network settings

### Port already in use

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### MongoDB connection error

1. Check username/password in connection string
2. Verify IP whitelist in MongoDB Atlas
3. Ensure database user has correct permissions
4. URL-encode special characters in password

### Module not found errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## 🔒 Security Notes

- Environment variables for sensitive data
- CORS configured for localhost
- Input validation on all forms
- Secure API endpoints

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contact

**Insyd Labs**
- Address: HD-119, WeWork Pavilion, Church Street, Bangalore - 560001
- Email: support@insydlabs.com

---

## 🙏 Acknowledgments

- Next.js for the React framework
- Tailwind CSS for styling
- Shadcn/ui for UI components
- MongoDB for database
- All open-source contributors
</artifact>

<artifact identifier="actual-problem-solving" type="application/vnd.ant.code" language="markdown" title="PROBLEM_SOLVING_DOCUMENT.md">
# Part 1: Problem Solving Document
## B2B Payment Management System

---

