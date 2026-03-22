# ◈ LeadFlow — Client Lead Management System (Mini CRM)

> A full-stack CRM built with React, Node.js, Express, and MongoDB.
> Internship project demonstrating CRUD, JWT auth, REST APIs, and business workflows.

---

## 📁 Project Structure

```
crm-system/
│
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT authentication guard
│   ├── models/
│   │   ├── Admin.js            # Admin user schema
│   │   └── Lead.js             # Lead schema
│   ├── routes/
│   │   ├── authRoutes.js       # Login, register, profile
│   │   └── leadRoutes.js       # Full CRUD for leads
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   └── server.js               # Express app entry point
│
├── frontend/                   # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js       # Sidebar + shell
│   │   │   └── ProtectedRoute.js  # Auth guard for routes
│   │   ├── context/
│   │   │   └── AuthContext.js  # Global auth state (React Context)
│   │   ├── pages/
│   │   │   ├── Login.js        # Admin login page
│   │   │   ├── Dashboard.js    # Analytics dashboard
│   │   │   ├── Leads.js        # Lead listing + filters
│   │   │   ├── LeadDetail.js   # Lead detail + notes
│   │   │   └── LeadForm.js     # Create / edit lead
│   │   ├── utils/
│   │   │   └── api.js          # Axios API config + helpers
│   │   ├── App.js              # Root component + routing
│   │   ├── index.js            # React entry point
│   │   └── styles.css          # Complete stylesheet
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) (local) OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/crm-system.git
cd crm-system
```

---

### Step 2 — Set Up the Backend

```bash
# Go into backend folder
cd backend

# Install dependencies
npm install

# Create your .env file from the template
cp .env.example .env
```

Now open `.env` and configure it:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_system   # or your Atlas URI
JWT_SECRET=replace_this_with_a_long_random_string
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@crm.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev      # development (auto-restarts on file changes)
# or
npm start        # production
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 CRM Backend Server Running → http://localhost:5000
```

---

### Step 3 — Create the First Admin

The database starts empty. Seed the first admin account by hitting this endpoint once:

```bash
curl -X POST http://localhost:5000/api/auth/seed
```

Or open in browser: `http://localhost:5000/api/auth/seed`

This creates an admin using your `.env` credentials (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---

### Step 4 — Set Up the Frontend

Open a new terminal:

```bash
# Go into frontend folder
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

React will open automatically at `http://localhost:3000`

---

### Step 5 — Login

Open `http://localhost:3000/login` and sign in with:
- **Email:** `admin@crm.com` (or your `.env` value)
- **Password:** `Admin@123` (or your `.env` value)

---

## 🔌 REST API Reference

All lead routes require an `Authorization: Bearer <token>` header.

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/seed` | ❌ | Create first admin (run once) |
| POST | `/api/auth/login` | ❌ | Login and get JWT token |
| GET  | `/api/auth/me` | ✅ | Get current admin info |
| POST | `/api/auth/register` | ✅ | Create additional admin |

### Lead Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET    | `/api/leads` | ✅ | Get all leads (paginated + filterable) |
| POST   | `/api/leads` | ✅ | Create new lead |
| GET    | `/api/leads/analytics` | ✅ | Dashboard stats |
| GET    | `/api/leads/:id` | ✅ | Get single lead |
| PUT    | `/api/leads/:id` | ✅ | Update a lead |
| PATCH  | `/api/leads/:id/status` | ✅ | Update status only |
| POST   | `/api/leads/:id/notes` | ✅ | Add a note |
| DELETE | `/api/leads/:id/notes/:noteId` | ✅ | Delete a note |
| DELETE | `/api/leads/:id` | ✅ | Delete a lead |

### Query Parameters for GET `/api/leads`

```
?search=john          # search by name, email, company
?status=new           # filter by: new | contacted | qualified | converted | lost
?source=website       # filter by source
?priority=high        # filter by priority
?page=1               # page number
?limit=10             # results per page
```

### Example API Requests

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"Admin@123"}'
```

**Create Lead:**
```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+91 9876543210",
    "company": "TechCorp India",
    "source": "website",
    "priority": "high",
    "message": "Interested in your premium plan"
  }'
```

**Update Status:**
```bash
curl -X PATCH http://localhost:5000/api/leads/LEAD_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status": "contacted"}'
```

**Add Note:**
```bash
curl -X POST http://localhost:5000/api/leads/LEAD_ID/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"text": "Called Priya, scheduled demo for Friday 3pm"}'
```

**Get Analytics:**
```bash
curl http://localhost:5000/api/leads/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🗄️ MongoDB Schemas

### Admin Schema
```javascript
{
  name:      String (required),
  email:     String (required, unique),
  password:  String (hashed with bcrypt),
  role:      String (default: "admin"),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Lead Schema
```javascript
{
  name:          String (required),
  email:         String (required),
  phone:         String,
  company:       String,
  source:        Enum [website, referral, social_media, email_campaign, cold_call, other],
  status:        Enum [new, contacted, qualified, converted, lost],
  priority:      Enum [low, medium, high],
  message:       String,
  assignedTo:    String,
  followUpDate:  Date,
  notes: [{
    text:      String (required),
    addedBy:   String,
    addedAt:   Date (auto)
  }],
  createdAt:     Date (auto),
  updatedAt:     Date (auto)
}
```

---

## 🌐 Deployment Guide

### Option A — Deploy Backend to Render (Free)

1. Push your project to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
5. Add environment variables from your `.env` file
6. Set `MONGODB_URI` to your **MongoDB Atlas** connection string
7. Deploy!

### Option B — Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo
3. Set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add environment variable: `REACT_APP_API_URL=https://your-render-backend.onrender.com/api`
5. Deploy!

### MongoDB Atlas (Free Cloud DB)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (for deployment)
5. Copy the connection string → paste as `MONGODB_URI` in your backend env vars

---

## 🔐 How JWT Authentication Works

```
1. Admin submits email + password → POST /api/auth/login
2. Server verifies credentials against MongoDB
3. Server creates JWT token containing admin's ID
4. Token is sent back to frontend
5. Frontend stores token in localStorage
6. Every subsequent API request includes the token in headers:
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
7. auth.js middleware verifies the token before each protected route
8. If valid → request proceeds; if invalid/expired → 401 response
```

---

## ✅ Features Implemented

- [x] Lead CRUD (Create, Read, Update, Delete)
- [x] Lead status pipeline (new → contacted → qualified → converted / lost)
- [x] Follow-up notes system (add & delete)
- [x] Admin JWT authentication (login, protected routes)
- [x] Search leads by name/email/company
- [x] Filter by status, source, priority
- [x] Pagination
- [x] Timestamp tracking (createdAt / updatedAt)
- [x] Analytics dashboard (totals, conversion rate, by source, monthly trend)
- [x] Responsive design (mobile-friendly)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Pure CSS (custom design system) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Dev Tools | nodemon, react-hot-toast |

---

## 📚 Learning Outcomes

This project demonstrates:
1. **REST API design** — proper HTTP methods, status codes, route structure
2. **MongoDB schema design** — embedded documents (notes inside leads)
3. **JWT authentication** — stateless auth flow, middleware pattern
4. **React patterns** — Context API, custom hooks, protected routes
5. **CRUD operations** — full create/read/update/delete with validation
6. **Business workflow** — sales pipeline status tracking
7. **Error handling** — both frontend and backend
8. **Pagination & filtering** — real-world data management patterns
