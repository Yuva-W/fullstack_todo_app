# Todo App — Full-Stack MERN with JWT & Role-Based Access

A production-ready Todo application built with **React, Node.js, Express, MongoDB, and JWT**. Implements secure authentication, role-based authorization, full Todo CRUD, search/filter/pagination, centralized validation & error handling, and backend integration tests.

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat&logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB_Mongoose-47A248?style=flat&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT_bcrypt-000000?style=flat&logo=jsonwebtokens)
![Tests](https://img.shields.io/badge/Tests-Jest_Supertest-99424F?style=flat&logo=jest)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Middleware](#middleware)
- [Validation Rules](#validation-rules)
- [Error Handling](#error-handling)
- [Frontend](#frontend)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Security](#security)
- [Learning Outcomes](#learning-outcomes)

---

## Features

### Authentication
- User registration & login
- Password hashing with `bcrypt`
- JWT generation with expiration (`jsonwebtoken`)
- Protected routes (frontend + backend)
- Logout (client-side token clear)
- Token stored in `localStorage`, sent as `Authorization: Bearer <token>`

### User Features
- Create / Read / Update / Delete Todos
- View Todo details
- Toggle `completed` / `pending`
- Server-side **search** (case-insensitive title regex)
- **Filter** by `completed=true|false`
- **Pagination** (`page`, `limit`)
- Ownership enforcement — users only see their own Todos

### Admin Features
- Admin authentication (same login, `role === "admin"`)
- Role-based access control (RBAC) via `adminMiddleware.js:1`
- `GET /api/admin/users` — list all users
- `GET /api/admin/todos/user/:id` — todos by user
- `GET /api/admin/todos` — all todos with search/filter/pagination
- `GET /api/admin/todos/:id` — single todo (any user)
- `DELETE /api/admin/todos/:id` — delete any todo

### Validation (Joi)
- Joi schemas in `server/middleware/validationSchemas.js:1`
- Generic middleware `server/middleware/validationMiddleware.js:1` with:
  - `abortEarly: false` → returns all errors at once
  - `stripUnknown: true` → silently removes unknown fields
  - Supports `body` and `query` validation

Validated: `register`, `login`, `createTodo`, `updateTodo`, `getTodosQuery`.

### Error Handling
Centralized `server/middleware/errorMiddleware.js:1` handles:
- Mongoose `ValidationError` → `400`
- Mongoose `CastError` (invalid ObjectId) → `400`
- Duplicate key `11000` → `409`
- Auth errors → `401` (via `authMiddleware.js:1`)
- Admin forbidden → `403`
- Resource not found → `404`
- Unknown endpoint → `404` (`server/app.js:30`)
- Fallback → `500`

### Testing
- Jest + Supertest + MongoDB Memory Server
- 4 suites / 41 tests

```
Test Suites: 4 passed, 4 total
Tests:       41 passed, 41 total
```

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| **Frontend** | React 19, React Router 7, Axios, Tailwind CSS 4, Vite 8, jwt-decode |
| **Backend**  | Node.js, Express 5, Mongoose 9, JWT 9, bcrypt 6, Joi 18, CORS, dotenv |
| **Testing**  | Jest 30, Supertest 7, MongoDB Memory Server 11 |
| **Database** | MongoDB (local or Atlas) |

---

## Project Structure

```
Todo_App/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoCard.jsx
│   │   │   ├── TodoDetails.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── UserDetails.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── NotFound.jsx
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── todoController.js
│   │   ├── adminController.js
│   │   └── adminTodoController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── validationMiddleware.js
│   │   ├── validationSchemas.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── user.js
│   │   └── Todo.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── todoRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── adminTodoRoutes.js
│   │   └── userRoutes.js
│   ├── tests/
│   │   └── integration/
│   │       ├── auth.edge.test.js
│   │       ├── todo.integration.test.js
│   │       ├── validation.test.js
│   │       └── notFound.test.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── LEARNING_GUIDE.md
```

---

## Architecture

```
              React Client (Vite)
                     |
                     |  HTTP / Axios
                     |  Authorization: Bearer <token>
                     v
              Express Server (app.js)
                     |
         +-----------+-----------+
         |           |           |
       Routes    Middleware   Controllers
         |        /  |  \         |
         |  Auth  RBAC Validation |
         |    \   |  /           |
         +----+---+---+----------+
                     |
                  Models (Mongoose)
                     |
                  MongoDB
```

**Request lifecycle:** `Routes` → `authMiddleware` → `adminMiddleware` (if admin) → `validationMiddleware` → `Controller` → `Model` → `MongoDB` → `Response` → `errorMiddleware` (on error).

---

## Authentication Flow

### Register
```
Client {name,email,password} → POST /api/auth/register
  → Joi validate (registerSchema)
  → Check existing user (email unique)
  → bcrypt.hash(password, 10)
  → Save User {role: "user" default}
  → 201 { success, user: {id,name,email,role} }
```

### Login
```
Client {email,password} → POST /api/auth/login
  → Joi validate (loginSchema)
  → Find User by email
  → bcrypt.compare(password, hash)
  → jwt.sign({userId, role}, JWT_SECRET, {expiresIn})
  → 200 { success, token }
  → Client stores token in localStorage
```

### Protected Request
```
Client → GET /api/todos
  Header: Authorization: Bearer <token>
  → authMiddleware verifies JWT → req.user = decoded
  → Controller filters by req.user.userId
```

User model role: `server/models/user.js:24`
```js
role: { type: String, enum: ["user","admin"], default: "user" }
```

---

## API Endpoints

Base URL: `http://localhost:5000`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login & get JWT |

**Register — Request**
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}
```
**Register — Response `201`**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": { "id": "...", "name": "John", "email": "john@example.com", "role": "user" }
}
```

**Login — Response `200`**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGci..."
}
```

### Todos (Protected — `Bearer <token>` required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/todos` | Create Todo |
| GET | `/api/todos?page=1&limit=10&search=react&completed=true` | List own Todos (paginated, searchable, filterable) |
| GET | `/api/todos/:id` | Get single Todo |
| PATCH | `/api/todos/:id` | Update Todo (partial) |
| DELETE | `/api/todos/:id` | Delete Todo |

**Create Todo — Request**
```json
{ "title": "Learn React", "description": "Hooks and components" }
```
**List Todos — Response `200`**
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 5,
  "totalPages": 1,
  "todos": [ { "_id": "...", "title": "...", "completed": false, "user": "..." } ]
}
```
**Update Todo — Request (any subset)**
```json
{ "title": "Learn Advanced React", "completed": true }
```

Ownership check in `server/controllers/todoController.js:69`:
```js
{ _id: req.params.id, user: req.user.userId }
```

### Admin (Requires `Authorization: Bearer <admin-token>` + `role === "admin"`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/todos` | List ALL todos (supports `page, limit, search, completed`) |
| GET | `/api/admin/todos/:id` | Get any Todo by ID |
| GET | `/api/admin/todos/user/:id` | Get Todos for a specific user |
| DELETE | `/api/admin/todos/:id` | Delete any Todo |

Example: `GET /api/admin/todos?page=1&limit=10&search=study&completed=true`

---

## Middleware

### `authMiddleware.js`
1. Reads `Authorization` header
2. Checks `Bearer <token>` format
3. Verifies JWT with `JWT_SECRET`
4. Attaches `req.user = decoded` (`{userId, role}`)
5. On failure → `401 { success:false, message:"Authentication required" | "Invalid or expired token" }`

### `adminMiddleware.js`
Checks `req.user.role !== "admin"` → `403`:
```json
{ "success": false, "message": "Admin access required..!" }
```

### `validationMiddleware.js`
Usage: `validate(schema, "body"|"query")` → `Joi.validate` with `{ abortEarly:false, stripUnknown:true }`.

---

## Validation Rules

| Schema | Field | Rules |
|--------|-------|-------|
| **register** | `name` | required, trim, 2–50 chars |
| | `email` | required, valid email, lowercased |
| | `password` | required, 6–100 chars |
| **login** | `email` | required, valid email, lowercased |
| | `password` | required |
| **createTodo** | `title` | required, trim, 1–200 chars |
| | `description` | optional, trim, max 1000, allow `""` |
| | `completed` | boolean, default `false` |
| **updateTodo** | `title/description/completed` | all optional, but **at least one** required (`.min(1)`) |
| **getTodosQuery** | `page` | int ≥1, default 1 |
| | `limit` | int 1–50, default 10 |
| | `search` | string, trim, max 100, allow `""` |
| | `completed` | boolean |

---

## Error Handling

| Scenario | Status | Response |
|----------|--------|----------|
| Validation failed | `400` | `{ success:false, message:"Validation failed", errors:[...] }` |
| No token | `401` | `{ success:false, message:"Authentication required" }` |
| Invalid/expired token | `401` | `{ success:false, message:"Invalid or expired token" }` |
| Not admin | `403` | `{ success:false, message:"Admin access required..!" }` |
| Invalid ObjectId | `400` | `{ success:false, message:"Invalid ID" }` |
| Todo not found | `404` | `{ success:false, message:"Todo not found" }` |
| Unknown route | `404` | `{ success:false, message:"API endpoint not found" }` |
| Server error | `500` | `{ success:false, message:"Internal server error" }` |

---

## Frontend

**Routes** (`client/src/App.jsx:15`)
| Path | Component | Guard |
|------|-----------|-------|
| `/` | redirect → `/login` | — |
| `/login` | `Login.jsx` | public |
| `/register` | `Register.jsx` | public |
| `/dashboard` | `Dashboard.jsx` | `ProtectedRoute.jsx` |
| `/admin` | `AdminDashboard.jsx` | `AdminRoute.jsx` (admin only) |
| `*` | `NotFound.jsx` | — |

**Reusable Components**
- `TodoCard.jsx` — compact Todo row with toggle/delete
- `TodoDetails.jsx` — expanded view (description, dates, status)
- `UserCard.jsx` — user summary for admin
- `UserDetails.jsx` — expanded user + their Todos
- `Navbar.jsx` — auth-aware navigation + logout

**Pagination (server-side)** — `server/controllers/todoController.js:44`
```js
const skip = (page - 1) * limit;
await Todo.find(filter).sort({createdAt:-1}).skip(skip).limit(limit);
```

**Search** — case-insensitive regex on `title`:
```js
filter.title = { $regex: search, $options: "i" };
```

**API Service** — `client/src/services/api.js` uses Axios interceptor to attach `Authorization: Bearer <token>` from `localStorage`.

---

## Testing

```bash
cd server
npm test
```

Jest config: `jest --runInBand` (sequential, avoids DB race). Uses `mongodb-memory-server` for isolated in-memory MongoDB.

| Suite | File | Covers |
|-------|------|--------|
| Auth edge | `auth.edge.test.js` | No token, malformed header, invalid/expired JWT, RBAC |
| Todo integration | `todo.integration.test.js` | CRUD, search, pagination, filtering, invalid ID, ownership |
| Validation | `validation.test.js` | Register/login/todo create/update/query bad inputs |
| 404 | `notFound.test.js` | Unknown API endpoints (GET/POST) |

---

## Environment Variables

Create `server/.env` (never commit):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/todo_app
JWT_SECRET=your_super_secret_key_change_in_production
# Optional:
JWT_EXPIRES_IN=7d
```

For frontend, if you need a configurable API URL, create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Add to `.gitignore`:
```
node_modules/
.env
dist/
```

---

## Installation

### Prerequisites
- Node.js ≥18, npm ≥9
- MongoDB locally or Atlas URI

### 1. Clone
```bash
git clone <your-repository-url>
cd Todo_App
```

### 2. Backend Setup
```bash
cd server
npm install
# create server/.env (see above)
npm run dev    # with nodemon
# or
npm start
# Backend → http://localhost:5000  (GET / → { message: "TaskFlow API is running" })
```

### 3. Create an Admin User
Register normally, then in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```
Or set `role` directly via Compass/shell.

### 4. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# Frontend → http://localhost:5173
```

### 5. Run Tests
```bash
cd ../server
npm test
```

---

## Available Scripts

**Server** (`server/package.json:6`)
| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm start` | Start production server (`node server.js`) |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm test` | Run Jest integration tests |

**Client** (`client/package.json:6`)
| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

---

## Security

- Passwords hashed with `bcrypt` (salt rounds 10) before save; never returned in responses
- JWT with expiration; verified on every protected route
- Role-based authorization — admin routes double-guarded (`auth` + `admin`)
- Joi validation with `stripUnknown: true` — extra fields discarded
- Todo ownership enforced at query level (`user: req.user.userId`)
- Centralized error handling — no stack traces leaked to client
- CORS enabled; body size limited to `40kb` (`server/app.js:13`)

---

## Learning Outcomes

**Frontend:** React components & hooks, state management, React Router guards, Axios interceptors, protected routes, Tailwind CSS, component separation, API integration, conditional rendering.

**Backend:** REST API design, Express routing, controllers, Mongoose schemas, middleware chaining, JWT/bcrypt auth, RBAC, Joi validation, error handling, pagination/search/filter patterns.

**Testing:** Jest integration tests, Supertest HTTP assertions, MongoDB Memory Server isolation, edge-case coverage.

---

## Contributing

```bash
git status
git add .
git commit -m "feat: your message"
git push
```

---

## License

ISC

> Built for learning full-stack architecture — feel free to fork, extend, and add features like due dates, tags, or real-time updates.
