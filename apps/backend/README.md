# MealDesk Backend

REST API for the MealDesk meal selection app. Built with **Fastify**, **Prisma**, and **PostgreSQL**.

## Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8
- PostgreSQL running locally (or a connection URL)

## Setup

### 1. Install dependencies
```bash
# from repo root
pnpm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mealdesk"
JWT_SECRET="your-secret-here"
PORT=3001
```

### 3. Run database migrations
```bash
pnpm db:migrate
# prompts for a migration name on first run — enter: init
```

### 4. Seed the database
```bash
pnpm db:seed
```

This creates:
- **Users**: `EMP001 / password123` (Employee), `HR001 / password123` (HR)
- **Menu options**: 4 demo meals (Grilled Chicken Bowl, Veggie Wrap, Beef Burger, Salmon Salad)
- **Active listing**: Today's lunch (09:00–11:00)

To import users from a CSV instead, create `prisma/users.csv`:
```
employeeId,name,role,password
EMP002,Jane Smith,EMPLOYEE,secret123
HR002,John HR,HR,secret456
```

### 5. Start the server
```bash
pnpm dev       # development (hot reload)
pnpm build     # compile to dist/
pnpm start     # run compiled output
```

Server runs on `http://localhost:3001`.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Login with employeeId + password → JWT |
| POST | `/api/auth/logout` | — | Logout (stateless, discard token on client) |

**Login request:**
```json
{ "employeeId": "EMP001", "password": "password123" }
```
**Login response:**
```json
{ "token": "<jwt>", "user": { "id": "...", "name": "Alice Employee", "role": "EMPLOYEE" } }
```

Pass the token in subsequent requests:
```
Authorization: Bearer <token>
```

---

### Listings
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/listings/active` | Employee / HR | Get current active listing with menu options |
| POST | `/api/listings` | HR only | Create a new listing (deactivates previous) |

**POST /api/listings body:**
```json
{
  "title": "Monday Lunch",
  "date": "2026-02-24",
  "startTime": "09:00",
  "endTime": "11:00"
}
```

---

### Selections
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/selections` | Employee / HR | Submit meal selection (409 if already submitted) |
| GET | `/api/selections/my-latest` | Employee / HR | Get current user's latest selection |

**POST /api/selections body:**
```json
{ "listingId": "<id>", "menuOptionId": "<id>" }
```

---

### Meals (HR only)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/meals` | HR | Add a menu option (multipart form) |
| PUT | `/api/meals/:id` | HR | Update a menu option (multipart form) |
| DELETE | `/api/meals/:id` | HR | Remove a menu option (soft delete if selections exist) |

**Multipart fields:** `name` (required), `description`, `category`, `image` (PNG/JPEG ≤ 5MB)

---

### Dashboard (HR only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Total users, submitted, pending counts |
| GET | `/api/dashboard/recent-submissions` | Last 20 submissions with employee name and meal |
| GET | `/api/dashboard/meal-counts` | Selection count per menu option |

---

### Admin (HR only)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/users` | Create a user account |

**POST /api/admin/users body:**
```json
{ "employeeId": "EMP003", "name": "Carol", "role": "EMPLOYEE", "password": "secret" }
```

---

## Health Check

```
GET /api/health → { "status": "ok" }
```

## Project Structure

```
src/
├── index.ts          entry point
├── app.ts            plugin + route registration
├── plugins/          fastify plugins (db, jwt, multipart)
├── middleware/        authenticate + requireRole guards
├── routes/           one file per resource
└── lib/saveImage.ts  image upload helper
prisma/
├── schema.prisma     DB schema
└── seed.ts           seed script
uploads/              served statically at /uploads/* (gitignored)
```
