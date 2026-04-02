# Kambaz Node Server

REST API backend for the Kambaz Learning Management System. Built with Node.js, Express 5, and MongoDB (Mongoose). Serves both the core LMS (courses, modules, assignments, enrollments, users) and the Pazza discussion board (posts, answers, follow-ups, replies, folders).

This server is the backend companion to the [kambas-next-js](../kambas-next-js) frontend.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [MongoDB Setup](#mongodb-setup)
  - [Running the Server](#running-the-server)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Users & Auth](#users--auth)
  - [Courses](#courses)
  - [Enrollments](#enrollments)
  - [Modules](#modules)
  - [Assignments](#assignments)
  - [Pazza — Posts](#pazza--posts)
  - [Pazza — Answers](#pazza--answers)
  - [Pazza — Follow-ups](#pazza--follow-ups)
  - [Pazza — Replies](#pazza--replies)
  - [Pazza — Folders](#pazza--folders)
- [MongoDB Collections](#mongodb-collections)
- [Architecture Notes](#architecture-notes)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | v18+ | Runtime |
| Express | 5.1.0 | HTTP framework |
| Mongoose | 9.0.0 | MongoDB ODM |
| MongoDB | 6+ | Database |
| express-session | 1.18.2 | Session-based authentication |
| cors | 2.8.5 | Cross-origin requests |
| dotenv | 17.2.3 | Environment variable loading |
| uuid | 13.0.0 | Unique ID generation |

---

## Project Structure

```
kambaz-node-server-app/
├── index.js                      # Express server entry point — registers all routes
├── .env                          # Environment variables (not committed)
│
├── Kambaz/
│   ├── Database/                 # Seed/sample data (JSON)
│   ├── Users/
│   │   ├── routes.js             # Auth + user CRUD routes
│   │   ├── dao.js                # Data access layer
│   │   ├── model.js              # Mongoose model
│   │   └── schema.js             # Mongoose schema
│   ├── Courses/
│   │   ├── routes.js             # Course + enrollment routes
│   │   ├── dao.js
│   │   ├── model.js
│   │   └── schema.js
│   ├── Modules/
│   │   ├── routes.js             # Module CRUD routes
│   │   ├── dao.js
│   │   ├── model.js
│   │   └── schema.js
│   ├── Assignments/
│   │   ├── routes.js             # Assignment CRUD routes
│   │   ├── dao.js
│   │   ├── model.js
│   │   └── schema.js
│   └── Enrollments/
│       ├── routes.js             # Legacy enrollment routes
│       ├── dao.js
│       ├── model.js
│       └── schema.js
│
└── Pazza/
    ├── Posts/
    │   ├── routes.js             # Post CRUD + view tracking
    │   ├── dao.js
    │   ├── model.js
    │   └── schema.js
    ├── Answers/
    │   ├── routes.js             # Student & instructor answers
    │   ├── dao.js
    │   ├── model.js
    │   └── schema.js
    ├── Followup/
    │   ├── routes.js             # Follow-up threads on posts
    │   ├── dao.js
    │   ├── model.js
    │   └── schema.js
    ├── Replies/
    │   ├── routes.js             # Replies to follow-ups (nested)
    │   ├── dao.js
    │   ├── model.js
    │   └── schema.js
    ├── Folders/
    │   ├── routes.js             # Post category folders per course
    │   ├── dao.js
    │   ├── model.js
    │   └── schema.js
    └── Dashboard/
        └── routes.js             # Pazza dashboard stats
```

---

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** v6 or higher running locally (or a MongoDB Atlas connection string)

---

## Getting Started

### MongoDB Setup

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify it's running:**
```bash
mongosh
# Should connect to mongodb://127.0.0.1:27017
```

The server uses the `kambaz` database. Mongoose creates it automatically on first write — no manual database setup required.

---

### Running the Server

```bash
# Install dependencies
npm install

# Create your .env file (see Environment Variables section)

# Start the server
npm start
```

The server runs on **http://localhost:4000** by default.

---

## Environment Variables

Create a `.env` file in the project root:

```env
SERVER_ENV=development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:4000
SESSION_SECRET=your-secret-phrase-here
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz
```

| Variable | Description |
|---|---|
| `SERVER_ENV` | Set to `production` to enable secure cookie settings |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `SERVER_URL` | This server's public URL |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `DATABASE_CONNECTION_STRING` | MongoDB connection string (local or Atlas) |

> For production, set `DATABASE_CONNECTION_STRING` to your MongoDB Atlas URI and `SERVER_ENV=production`.

---

## API Reference

All routes are prefixed with `/api/`. Session cookies are required for authenticated endpoints — the frontend must send requests with `withCredentials: true`.

---

### Users & Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/users/signup` | No | Register a new user |
| `POST` | `/api/users/signin` | No | Sign in and create session |
| `POST` | `/api/users/signout` | Yes | Destroy session |
| `POST` | `/api/users/profile` | Yes | Get current session user |
| `GET` | `/api/users` | No | Get all users (supports `?role=` and `?name=` query params) |
| `GET` | `/api/users/:userId` | No | Get a user by ID |
| `POST` | `/api/users` | No | Create a user |
| `PUT` | `/api/users/:userId` | Yes | Update a user (also updates session if updating self) |
| `DELETE` | `/api/users/:userId` | No | Delete a user |

---

### Courses

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/courses` | No | Get all courses |
| `POST` | `/api/users/current/courses` | Yes | Create a course (auto-enrolls creator) |
| `PUT` | `/api/courses/:courseId` | No | Update a course |
| `DELETE` | `/api/courses/:courseId` | No | Delete a course and all its enrollments |
| `GET` | `/api/courses/:cid/users` | No | Get all users enrolled in a course |

---

### Enrollments

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/:userId/courses` | No | Get all courses a user is enrolled in (`userId` can be `"current"`) |
| `POST` | `/api/users/:uid/courses/:cid` | Yes | Enroll a user in a course (`uid` can be `"current"`) |
| `DELETE` | `/api/users/:uid/courses/:cid` | Yes | Unenroll a user from a course (`uid` can be `"current"`) |

---

### Modules

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/courses/:courseId/modules` | No | Get all modules for a course |
| `POST` | `/api/courses/:courseId/modules` | No | Create a module for a course |
| `PUT` | `/api/courses/:courseId/modules/:moduleId` | No | Update a module |
| `DELETE` | `/api/courses/:courseId/modules/:moduleId` | No | Delete a module |

---

### Assignments

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/assignments` | No | Get all assignments |
| `GET` | `/api/assignments/course/:courseId` | No | Get assignments for a course |
| `GET` | `/api/assignments/:assignmentId` | No | Get a single assignment |
| `POST` | `/api/assignments` | No | Create an assignment |
| `PUT` | `/api/assignments/:assignmentId` | No | Update an assignment |
| `DELETE` | `/api/assignments/:assignmentId` | No | Delete an assignment |

---

### Pazza — Posts

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/pazza/:courseId/posts` | Yes | Get all posts for a course |
| `GET` | `/api/pazza/posts/:postId` | Yes | Get a single post (marks as read) |
| `POST` | `/api/pazza/posts` | Yes | Create a new post |
| `PUT` | `/api/pazza/posts/:postId` | Yes | Edit a post |
| `DELETE` | `/api/pazza/posts/:postId` | No | Delete a post |
| `PUT` | `/api/pazza/posts/:postId/views` | Yes | Mark a post as read by the current user |

---

### Pazza — Answers

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/pazza/posts/:postId/student_answer` | Yes | Add a student answer to a post |
| `POST` | `/api/pazza/posts/:postId/instructor_answer` | Yes | Add an instructor answer to a post |
| `PUT` | `/api/pazza/posts/answer/:answerId` | Yes | Edit an answer |
| `DELETE` | `/api/pazza/posts/:postId/student_answer/:answerId` | No | Delete a student answer |
| `DELETE` | `/api/pazza/posts/:postId/instructor_answer/:answerId` | No | Delete an instructor answer |

---

### Pazza — Follow-ups

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/pazza/posts/:postId/followup` | Yes | Add a follow-up thread to a post |
| `PUT` | `/api/pazza/posts/:postId/followup/:followupId` | Yes | Edit a follow-up |
| `DELETE` | `/api/pazza/posts/:postId/followup/:followupId` | Yes | Delete a follow-up |

---

### Pazza — Replies

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/pazza/posts/:postId/followup/:followupId/reply` | Yes | Reply to a follow-up |
| `POST` | `/api/pazza/posts/:postId/followup/:followupId/reply/:replyId` | Yes | Reply to a reply (nested) |
| `PUT` | `/api/pazza/posts/:postId/followup/:followupId/reply/:replyId` | Yes | Edit a reply |
| `PUT` | `/api/pazza/posts/:postId/followup/:followupId/reply/:parentReplyId/:replyId` | Yes | Edit a nested reply |
| `DELETE` | `/api/pazza/posts/:postId/followup/:followupId/reply/:replyId` | No | Delete a reply |
| `DELETE` | `/api/pazza/posts/:postId/followup/:followupId/reply/:parentReplyId/:replyId` | No | Delete a nested reply |

---

### Pazza — Folders

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/pazza/folders` | No | Get all folders |
| `GET` | `/api/pazza/:courseId/folders` | No | Get folders for a course |
| `GET` | `/api/pazza/:courseId/folders/:folderId` | Yes | Get posts filtered by folder |
| `POST` | `/api/pazza/:courseId/folders` | No | Create a folder for a course |
| `PUT` | `/api/pazza/:courseId/folders/:folderId` | No | Rename a folder |
| `DELETE` | `/api/pazza/:courseId/folders/delete` | No | Delete folders from a course |

---

## MongoDB Collections

All collections live in the `kambaz` database.

| Collection | Key Fields | Description |
|---|---|---|
| `users` | `_id`, `username`, `role` | Registered users; roles: `STUDENT`, `FACULTY`, `ADMIN`, `USER` |
| `courses` | `_id`, `name`, `number` | Course records with name, number, dates, and description |
| `modules` | `_id`, `course` | Content modules linked to a course |
| `assignments` | `_id`, `course` | Assignments with title, due date, and points |
| `enrollments` | `_id` (`userId-courseId`), `user`, `course` | Join table linking users to courses |
| `posts` | `_id`, `course`, `author`, `folder` | Pazza discussion posts |
| `answers` | embedded in posts | Student and instructor answers on posts |
| `followups` | embedded in posts | Follow-up discussion threads |
| `replies` | embedded in followups | Nested replies within follow-up threads |
| `folders` | `_id`, `course`, `name` | Post category folders per course |

---

## Architecture Notes

- **DAO pattern** — Each resource has a `dao.js` that encapsulates all Mongoose queries. Routes call DAO methods; no Mongoose queries appear directly in route handlers.
- **Session auth** — Authentication uses `express-session`. Protected routes read `req.session["currentUser"]`. The special string `"current"` in path params (e.g. `/api/users/current/courses`) resolves to the session user's ID.
- **ES Modules** — The project uses `"type": "module"` in `package.json`, so all files use `import`/`export` syntax.
- **CORS** — Configured to allow credentials from `CLIENT_URL` (default: `http://localhost:3000`). In production, set `SERVER_ENV=production` to enable `sameSite: "none"` and `secure: true` on session cookies.
