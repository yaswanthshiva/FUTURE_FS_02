# Mini CRM - Frontend

A premium, modern React dashboard for managing business sales leads. Built using a sleek dark-themed glassmorphism design system.

## 🚀 Features

* **Secure Admin Access:** Integrated with JWT authentication (Login/Signup flows) and Client-Side Route Guarding.
* **Lead Analytics Dashboard:** Real-time calculation of Total Leads, Converted Leads, and Sales Conversion Rate.
* **Lead Management:**
  * Interactive lead list table with responsive scroll container.
  * Real-time Lead status updates ("New", "Contacted", "Converted") via interactive dropdown selects.
  * Inline Lead creation form (generating name automatically from email if not provided).
  * Smooth Lead deletion with state synchronization.
* **Visual Polish:** Implemented using CSS Variables, custom scrollbars, animated cards, soft radial glows, and interactive hover transitions.

---

## 🛠️ Tech Stack

* **Core:** React 19, React Router v7
* **HTTP Client:** Axios (configured with request interceptors to auto-inject Bearer tokens)
* **Styling:** Vanilla CSS (Custom Design System with dark mode variables)

---

## ⚙️ Installation & Setup

1. **Install Dependencies:**
   Make sure you are in the `frontend` folder and install packages:
   ```bash
   npm install
   ```

2. **Backend Requirement:**
   Ensure the Express backend server is running on `http://localhost:5000` (which handles the API endpoints).

3. **Start the Development Server:**
   ```bash
   npm start
   ```
   The app will start in development mode at `http://localhost:3000`.

---

## 📂 Folder Structure

```text
frontend/
├── public/
└── src/
    ├── components/
    │   ├── Analytics.js    # Metric cards calculations
    │   ├── Dashboard.js    # Protected Dashboard page with header, user details, and logout
    │   ├── LeadForm.js     # Add Lead form
    │   ├── LeadTable.js    # Lead data table with status select
    │   ├── Login.js        # Sign-in page
    │   └── Signup.js       # Register page
    ├── services/
    │   └── api.js          # Axios configuration with auth interceptors
    ├── App.js              # Route configurations
    ├── index.js            # React mounting point
    ├── index.css           # Global typography & design variables
    ├── Auth.css            # Styles for auth forms
    └── Dashboard.css       # Styles for metrics, forms, and tables
```
