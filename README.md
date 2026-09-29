# PollNow 🗳️

> **Create. Share. Vote.**  
> Create beautiful polls in seconds and get answers instantly — zero sign-up required.

---

## 📌 About the Project

**PollNow** is an anonymous polling web application built with the **MERN stack** (MongoDB, Express, React, Node.js). 

It removes all friction from online polling:
- **No Sign-Up or Login**: Anyone can create a poll or vote immediately.
- **Unique Shareable Links**: Every poll gets a short URL (e.g. `/p/Ab72xK`) to share across Slack, WhatsApp, Twitter, Discord, or email.
- **Fair Anonymous Voting**: Prevents duplicate voting using anonymous voter identification and MongoDB unique compound indexing.
- **Atomic Vote Processing**: Race-condition-free counting so vote tallies always stay consistent.
- **Poll Customization**: Single or multiple choice, customizable expiration (10 min to 30 days), and results visibility controls.
- **Live Results & Analytics**: Instant percentage progress bars and interactive donut charts.
- **Poll Management**: Creators receive a private key to close or delete their poll anytime.
- **Dark & Light Themes**: Modern design with dark mode default and light mode toggle.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router, Tailwind CSS, Framer Motion, Recharts, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Helmet, Express Rate Limit, Nanoid

---

## 🚀 How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 (or a MongoDB Atlas connection URI)

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup

- **`server/.env`**:
  ```env
  PORT=5000
  MONGODB_URI=mongodb://127.0.0.1:27017/pollnow
  CLIENT_URL=http://localhost:5173
  NODE_ENV=development
  ```

- **`client/.env`**:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```

### 4. Start the Application

**Start the Backend API:**
```bash
cd server
npm start
```
*(Runs at `http://localhost:5000`)*

**Start the Frontend:**
```bash
cd client
npm run dev
```
*(Runs at `http://localhost:5173`)*

---

## 📄 License
MIT License. Free to use and modify.
