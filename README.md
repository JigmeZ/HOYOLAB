# HOYOLAB Clone

A full-stack clone of HOYOLAB built with React (frontend) and Node.js/Express/Prisma (backend).

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Main Concepts](#main-concepts)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Development Notes](#development-notes)

---

## Project Structure

```
HOYOLAB/
├── hoyolab-clone/         # Frontend (React + Vite)
│   └── src/
│       └── ...components, pages, assets, etc.
├── Hoyo backend/          # Backend (Node.js + Express + Prisma)
│   └── src/
│       └── ...controllers, routes, index.js, etc.
```

---

## Features

- User registration and login (JWT authentication)
- File uploads (images, videos) with Multer
- Posts, likes, comments, and following users
- Profile page with user info and posts
- Responsive UI with React, React Router, and custom CSS
- Persistent authentication and state with localStorage

---

## Main Concepts

- **Frontend (React):**
  - Component-based architecture for modular UI
  - State management using React hooks (`useState`, `useEffect`)
  - Routing with `react-router-dom`
  - File uploads using `react-dropzone` and progress feedback
  - LocalStorage for authentication and user state
  - Responsive and modern UI with custom CSS

- **Backend (Node.js/Express):**
  - RESTful API design
  - Authentication with JWT and password hashing (bcryptjs)
  - File uploads and static file serving with Multer
  - Data persistence with Prisma ORM and SQLite/PostgreSQL
  - Modular route/controller structure

---

## Getting Started

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd "Hoyo backend"
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your `DATABASE_URL` and `JWT_SECRET`.

3. **Setup database:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start backend server:**
   ```bash
   npm run dev
   ```
   The backend runs on [http://localhost:4000](http://localhost:4000).

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd hoyolab-clone
   npm install
   ```

2. **Start frontend dev server:**
   ```bash
   npm run dev
   ```
   The frontend runs on [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

---

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `POST /api/upload/image` — Upload an image file
- `POST /api/upload/video` — Upload a video file
- `POST /api/posts` — Create a new post (after upload)
- `GET /api/posts` — Get all posts
- `POST /api/posts/:id/like` — Like a post
- `POST /api/posts/:id/comment` — Comment on a post

See backend `src/index.js` for more.

---

## Development Notes

- **Authentication:** JWT tokens are stored in localStorage and sent with requests.
- **File Uploads:** Uploaded files are stored in `/uploads` and served statically.
- **Database:** Uses Prisma ORM. See `prisma/schema.prisma` for models.
- **Frontend/Backend Communication:** All API requests from frontend point to `http://localhost:4000`.

---

## License

MIT

