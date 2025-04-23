# Hoyolab Clone - Backend

This is the backend service for the Hoyolab Clone project. It provides APIs and handles server-side logic for the application.

## Features

- User authentication and authorization
- API endpoints for managing posts, interest groups, and user profiles
- Database integration for persistent data storage
- Secure handling of sensitive data

## Prerequisites

Before running the backend, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) or any other database you plan to use

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/hoyolab-clone.git
   cd hoyolab-clone/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and configure the following environment variables:
   ```
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/hoyolab
   JWT_SECRET=your_jwt_secret
   ```

## Running the Backend

To start the backend server, run:

```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in an existing user

### Posts

- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Interest Groups

- `GET /api/groups` - Get all interest groups
- `POST /api/groups` - Create a new interest group

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Folder Structure

```
backend/
├── controllers/    # Route handlers
├── models/         # Database models
├── routes/         # API routes
├── middlewares/    # Custom middleware
├── utils/          # Utility functions
├── config/         # Configuration files
└── server.js       # Entry point for the backend
```


