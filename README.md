# 💰 Expense Approval System

A full-stack monorepo application for submitting, reviewing, and managing employee expense claims.

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** SQLite
* **ORM:** Prisma
* **Tools:** npm, concurrently, tsx

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* npm 9+
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/Shrest2k5/expense-approval-system.git
cd expense-approval-system
```

### 2. Install Dependencies

```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Setup Database

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
cd ..
```

### 4. Run the Application

```bash
npm start
```

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

## ✨ Features

### Employee

* Submit expense claims
* Form validation
* View submitted expenses
* Expenses start with `PENDING` status

### Manager

* View all expense claims
* Approve or reject expenses
* View total approved amount
* Status updates persist in SQLite

## 🔌 API Endpoints

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/api/expenses`            | Get all expenses       |
| POST   | `/api/expenses`            | Create an expense      |
| PATCH  | `/api/expenses/:id/status` | Approve/Reject expense |
| GET    | `/api/health`              | Health check           |

## 📂 Project Structure

```text
expense-approval-system/
├── client/                 # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/     # UI components (ExpenseForm, ManagerDashboard, etc.)
│   │   ├── api.ts          # API client for backend communications
│   │   └── App.tsx         # Main application component
│   └── package.json
├── server/                 # Express + TypeScript + Prisma backend
│   ├── prisma/
│   │   ├── schema.prisma   # Prisma schema definition
│   │   ├── seed.ts         # Database seed script
│   │   └── dev.db          # SQLite local database
│   ├── src/
│   │   ├── routes/         # Express routes
│   │   └── index.ts        # Server entry point
│   └── package.json
├── DECISIONS.md            # Architectural decisions & assumptions document
├── README.md               # Setup and evaluation instructions
└── package.json            # Monorepo setup scripts
```

## 👨‍💻 Author

**Shrest Shaw**
GitHub: [Shrest2k5](https://github.com/Shrest2k5)
