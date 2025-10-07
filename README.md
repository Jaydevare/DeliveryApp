# Delivery Management System

A full-stack delivery management application built with Next.js (TypeScript) frontend and Express.js backend, featuring role-based authentication and real-time order tracking with map visualization.

## 🚀 Features

### Admin Dashboard
- Create and manage delivery orders
- Create and manage delivery partners
- Assign orders to available partners
- Track order status and partner assignments
- View order history and statistics

### Partner Dashboard
- View assigned orders on an interactive map
- Update order status (picked up, delivered)
- Manage availability status (available/busy)
- Real-time order tracking

### Authentication & Authorization
- Role-based access control (Admin/Partner)
- Secure JWT authentication
- Protected routes and API endpoints

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **React Leaflet** for map visualization
- **React Hooks** for state management

### Backend
- **Express.js** with TypeScript
- **MongoDB** with Mongoose
- **JWT** for authentication
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd deliveryApp
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/deliveryapp
JWT_SECRET=your_jwt_secret_key
HOST=localhost
PORT=8181
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_URL=http://localhost:8181
```

Start the frontend development server:
```bash
npm run dev
```



