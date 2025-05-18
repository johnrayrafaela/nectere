# Fresh Start Cleaning Service App

## 📌 Project Overview
Fresh Start is a cleaning service web application built using the **MERN stack** (MongoDB, Express.js, React, and Node.js). It includes:
- **User Authentication** (Login/Register)
- **User Profiles**
- **Admin Dashboard** (for managing services)
- **Cleaning Services Management**

## 🚀 Tech Stack
- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT

---

## 🔧 Backend Setup

### 1️⃣ Install Dependencies
```sh
cd backend
npm install
```

### 2️⃣ Set Up Environment Variables

MONGO_URI=mongodb+srv://johnray_raf:johnrayraf123@cluster0.ocdjm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret
PORT=5000

### 3️⃣ Run the Backend Server
```sh
npm run dev
```

The backend should now be running at `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1️⃣ Install Dependencies
```sh
cd frontend
npm install
```

### 2️⃣ Start the Frontend
```sh
npm start
```
The frontend should now be running at `http://localhost:3000`

---

## 📡 API Testing with Postman

### 🟢 **User Endpoints**

#### 🔹 Register a User
**POST** `http://localhost:5000/api/users/register`
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "phonenumber": "1234567890",
  "password": "password123"
}
```

#### 🔹 Login a User
**POST** `http://localhost:5000/api/users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### 🟢 **Service Endpoints**

#### 🔹 Add a New Cleaning Service
**POST** `http://localhost:5000/api/cleaning-services/add`
```json
{
  "name": "Deep Cleaning",
  "description": "A thorough cleaning service for homes and offices.",
  "price": 99.99
}
```

#### 🔹 Get All Services
**GET** `http://localhost:5000/api/cleaning-services`

#### 🔹 Delete a Service (Admin Only)
**DELETE** `http://localhost:5000/api/cleaning-services/:id`

---

## ✅ Features to Test
- Register/Login as a **user**
- Access **profile page** after login
- can **add**, **view**, and **delete** cleaning services

### 💡 Notes
- Ensure MongoDB is running.
- Test API routes in **Postman** before integrating with frontend.

🚀 Happy coding! If you have any issues, let me know! 🎯

