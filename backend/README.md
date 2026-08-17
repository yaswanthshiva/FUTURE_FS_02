# Mini CRM - Backend API

A secure Node.js Express REST API for the Mini CRM application, powered by MongoDB and Mongoose.

## 🚀 Features

* **Admin Authentication:** Complete registration and login system with bcrypt password hashing and JWT token signing.
* **Lead Operations (CRUD):** Fully protected REST endpoints for managing sales leads:
  * `GET /api/leads` - Fetch all leads (sorted by newest).
  * `POST /api/leads` - Add a new lead.
  * `PUT /api/leads/:id` - Update a lead's status.
  * `DELETE /api/leads/:id` - Delete a lead.
* **Security Middleware:** Custom `authMiddleware` validates JWT tokens on all lead endpoints.
* **Database Integration:** Direct schema modeling with Mongoose validation and robust connection error handling.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **Database ODM:** Mongoose (MongoDB)
* **Security:** jsonwebtoken, bcryptjs, cors

---

## ⚙️ Setup & Installation

1. **Install Dependencies:**
   Navigate to the `backend` folder and run:
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the `backend` root and configure the variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/minicrm
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Start the Database:**
   Ensure MongoDB is installed and running on your local machine (`localhost:27017`).

4. **Run the Server:**
   * For production:
     ```bash
     npm start
     ```
   * For development (with hot-reload):
     ```bash
     npm run dev
     ```
   The backend server will run on `http://localhost:5000`.
