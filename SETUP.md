# 🚀 Production Reporting System - Professional PWA

Complete Production Reporting System with MongoDB, Role-Based Authentication, and PWA capabilities.

## ✅ Features Implemented

- ✅ **Complete Database Models** - MongoDB with Mongoose (User, Machine, Production)
- ✅ **JWT Authentication** - Secure token-based auth with bcrypt password hashing
- ✅ **Role-Based Access Control** - Admin, Supervisor, Operator roles with middleware
- ✅ **Service Layer Architecture** - Clean separation of business logic
- ✅ **Centralized API Client** - Axios instance with interceptors
- ✅ **Custom React Hooks** - useAuth, useProductions for state management
- ✅ **React Hook Form + Zod** - Form validation with schemas
- ✅ **Sonner Toasts** - Beautiful toast notifications (not react-hot-toast)
- ✅ **Shadcn UI Components** - Modern, accessible UI components
- ✅ **Urdu RTL Support** - Right-to-left layout for Urdu text
- ✅ **Protected Routes** - Client-side route protection
- ✅ **Complete API Routes** - Auth, Productions, Machines, Users, Reports
- ✅ **Professional Dashboard** - Admin and Operator dashboards with stats
- ✅ **PWA Ready** - Configured with next-pwa

## 📁 Project Structure

```
production-reporting-system/
├── app/
│   ├── api/
│   │   ├── auth/ (login, register, me, logout)
│   │   ├── productions/ (CRUD operations)
│   │   ├── machines/ (CRUD operations)
│   │   ├── users/ (CRUD operations)
│   │   └── reports/ (summary, daily reports)
│   ├── dashboard/
│   │   ├── admin/ (Admin dashboard with stats)
│   │   ├── operator/ (Operator dashboard)
│   │   └── reports/ (Reports page)
│   ├── login/ (Login page with form)
│   ├── register/ (Registration page)
│   ├── layout.js (Root layout with Sonner)
│   └── page.js (Redirects to login)
├── components/
│   ├── forms/
│   │   ├── ProductionForm.jsx (Complete production entry form)
│   │   └── MachineForm.jsx (Machine management form)
│   ├── layout/
│   │   ├── ProtectedRoute.jsx (Auth guard)
│   │   ├── Sidebar.jsx (Navigation sidebar)
│   │   └── Header.jsx (Top header with user info)
│   ├── shared/
│   │   ├── StatsCard.jsx (Dashboard stat cards)
│   │   └── DataTable.jsx (Reusable table component)
│   └── ui/ (Shadcn components)
├── lib/
│   ├── api/
│   │   ├── client.js (Axios instance with interceptors)
│   │   ├── endpoints.js (All API endpoints organized)
│   │   └── index.js (Exports)
│   ├── db/
│   │   ├── connect.js (MongoDB connection with caching)
│   │   └── models/ (User, Machine, Production models)
│   ├── hooks/
│   │   ├── useAuth.js (Authentication hook with login/logout)
│   │   └── useProductions.js (Productions CRUD hook)
│   ├── middleware/
│   │   └── auth.js (JWT verification & withAuth HOC)
│   ├── services/
│   │   ├── auth.service.js (Auth business logic)
│   │   ├── production.service.js (Production business logic)
│   │   ├── machine.service.js (Machine business logic)
│   │   ├── user.service.js (User business logic)
│   │   └── report.service.js (Reports & analytics)
│   └── utils/
│       ├── jwt.js (Token generation & verification)
│       ├── constants.js (App constants)
│       └── helpers.js (Utility functions)
├── types/
│   └── index.js (Type definitions/constants)
├── .env.local (Environment variables)
├── next.config.js (Next.js configuration)
└── package.json (Dependencies)
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

All required packages are already in package.json:
- mongoose, bcryptjs, jsonwebtoken (Backend)
- axios, react-hook-form, zod, sonner (Frontend)
- next-pwa (PWA support)
- All Shadcn UI dependencies

### 2. Configure Environment Variables

Edit `.env.local` and add your MongoDB connection:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/production_db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=7d
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Seed Database (Recommended)

```bash
npm run seed
```

This will create:
- 8 Users (2 Admins, 2 Supervisors, 4 Operators)
- 5 Machines (different types and locations)
- 90+ Production records (last 30 days)

**All user passwords: `abc@123`**

User credentials:
- **Admin:** admin@example.com / abc@123
- **Admin:** ahmed@example.com / abc@123
- **Supervisor:** supervisor1@example.com / abc@123
- **Supervisor:** ali@example.com / abc@123
- **Operator:** operator1@example.com / abc@123
- **Operator:** operator2@example.com / abc@123
- **Operator:** hussain@example.com / abc@123
- **Operator:** zubair@example.com / abc@123

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login

Use any of the seeded credentials:
- Email: admin@example.com
- Password: abc@123

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout

### Productions
- `GET /api/productions` - Get all productions (with filters)
- `POST /api/productions` - Create production
- `GET /api/productions/[id]` - Get production by ID
- `PUT /api/productions/[id]` - Update production
- `DELETE /api/productions/[id]` - Delete production

### Machines
- `GET /api/machines` - Get all machines
- `POST /api/machines` - Create machine (Admin only)
- `GET /api/machines/[id]` - Get machine by ID
- `PUT /api/machines/[id]` - Update machine (Admin only)
- `DELETE /api/machines/[id]` - Delete machine (Admin only)

### Users
- `GET /api/users` - Get all users (Admin/Supervisor)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user (Admin only)
- `DELETE /api/users/[id]` - Delete user (Admin only)

### Reports
- `GET /api/reports/summary` - Get summary statistics
- `GET /api/reports?date=YYYY-MM-DD` - Get daily report

## 🔐 User Roles

### Admin
- Full access to all features
- Can manage users, machines, and productions
- View all reports and analytics
- Dashboard: `/dashboard/admin`

### Supervisor
- Can create and manage productions
- View reports
- Manage operators

### Operator
- Can create production entries
- View own productions only
- Dashboard: `/dashboard/operator`

## 🎨 Key Features

### 1. Smart Form with Auto-Calculation
ProductionForm automatically calculates total weight:
```javascript
totalWeight = pieceWeight × totalPieces
```

### 2. Centralized API Client
All API calls go through a single client with:
- Automatic token injection
- Error handling
- 401 redirect to login

### 3. Service Layer
Business logic separated from API routes:
- Reusable across multiple endpoints
- Easy to test
- Clean code organization

### 4. Custom Hooks
- `useAuth()` - Login, logout, register, auth state
- `useProductions()` - CRUD operations with toast notifications

### 5. Role-Based Middleware
```javascript
export const GET = withAuth(handler, ['admin', 'supervisor']);
```

## 📱 PWA Features

To enable PWA (configured but optional):
- Offline support
- Install as app
- Background sync

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Environment variables:
- Add `MONGODB_URI` in Vercel dashboard
- Add `JWT_SECRET` in Vercel dashboard

### Manual Build

```bash
npm run build
npm run start
```

## 📝 Notes

- All code is in **JavaScript** (not TypeScript)
- Uses **Sonner** for toasts (not react-hot-toast)
- RTL (Right-to-Left) support for Urdu text
- All forms use react-hook-form + zod validation
- MongoDB indexes on Production for better query performance

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check your MongoDB URI is correct
- Ensure IP whitelist includes your IP (0.0.0.0/0 for dev)
- Verify database user has read/write permissions

### Toast Not Showing
- Sonner Toaster is in root layout
- Import: `import { toast } from 'sonner'`
- Use: `toast.success('message')` or `toast.error('message')`

### 401 Unauthorized
- Check token in localStorage
- Verify JWT_SECRET matches between signup and login
- Token automatically added to requests via axios interceptor

## 🎉 Complete Professional System Ready!

Made with ❤️ for your production reporting needs.
