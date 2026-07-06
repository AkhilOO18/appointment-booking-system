# QuickBook — Appointment Booking System (MERN)

A full-stack appointment booking app. Customers browse services and book a slot;
admins manage services and every booking. Built with MongoDB, Express, React, Node.

Rename "QuickBook" and "services" in the UI text to match your chosen theme
(salon, clinic, tutoring, car service, etc.) — the code underneath doesn't change.

## Screenshots

**Homepage**
![Homepage](screenshots/Homepage.png)

**Browse Services**
![Services](screenshots/Services.png)

**Book an Appointment**
![Booking](screenshots/Booking.png)

**Admin Dashboard**
![Admin Dashboard](screenshots/Admin-dashboard.png)

---

## What's included

**Backend** (`/backend`)
- Express REST API
- MongoDB models: `User`, `Service`, `Appointment`
- JWT authentication, bcrypt password hashing
- Role-based access: `user` vs `admin` (the very first person to register becomes admin automatically)

**Frontend** (`/frontend`)
- React (Vite) with React Router
- Pages: Home, Login, Register, Services, Book Appointment, My Appointments, Admin Dashboard
- Axios client that auto-attaches the login token

---

## Setup (do this first — ~20 minutes)

### 1. Install Node.js
Download from https://nodejs.org (LTS version) if you don't have it. Check with:
```
node -v
```

### 2. Get a MongoDB database
Easiest option — MongoDB Atlas (free, cloud, no install):
1. Go to https://www.mongodb.com/cloud/atlas and create a free account
2. Create a free "M0" cluster
3. Under **Database Access**, create a user with a password
4. Under **Network Access**, add IP `0.0.0.0/0` (allow from anywhere — fine for a college project)
5. Click **Connect** → **Drivers** → copy the connection string, it looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/appointment-booking`

Alternative — install MongoDB locally from https://www.mongodb.com/try/download/community
and use `mongodb://127.0.0.1:27017/appointment-booking` instead.

### 3. Backend setup
```
cd backend
npm install
cp .env.example .env
```
Open `.env` and paste your MongoDB connection string into `MONGO_URI`.
Set `JWT_SECRET` to any random long string (e.g. mash your keyboard).

Run it:
```
npm run dev
```
You should see `MongoDB connected successfully` and `Server running on http://localhost:5000`.
Visit http://localhost:5000 in a browser — it should say "Appointment Booking API is running".

### 4. Frontend setup
Open a **new terminal window** (keep the backend running in the first one):
```
cd frontend
npm install
npm run dev
```
Visit http://localhost:5173 — the app should load.

---

## How to use it / demo it

1. **Register an account** — the first account you create automatically becomes an **admin**.
   Register a second account normally to test the customer side.
2. Log in as admin → go to **Admin Dashboard → Manage Services** → add 2-3 services
   (e.g. "Haircut", "Consultation", whatever fits your theme).
3. Log out, log in as your second (regular) account → go to **Services** → book one.
4. Check **My Appointments** as the customer.
5. Log back in as admin → **Admin Dashboard → Appointments** → change the status to "Confirmed".

That flow (register → admin adds services → user books → admin confirms) is your demo script.

---

## 2-day plan if you're building/customizing this yourself

**Day 1 — Backend + understand the code (don't touch frontend yet)**
- Hour 1: Get MongoDB Atlas set up, get backend running, confirm the health-check page loads
- Hour 2-3: Open `models/`, `routes/authRoutes.js` and read every line — this is the part
  most vivas/evaluations ask about ("how does login work", "how is the password protected")
- Hour 3-4: Test the API directly with a tool like Postman or Thunder Client (VS Code extension):
  - POST `/api/auth/register` with `{ "name": "Admin", "email": "admin@test.com", "password": "test123" }`
  - POST `/api/auth/login` with the same email/password → copy the returned token
  - GET `/api/services` (no auth needed)
  - POST `/api/services` with header `Authorization: Bearer <token>` to add a service
- Hour 4-5: Rename things to your theme in the database content (not code) — add real service names

**Day 2 — Frontend + polish + rehearse**
- Hour 1-2: Get frontend running, click through every page, fix any typos/rebranding
- Hour 2-3: Change "QuickBook" branding, colors if you want (`frontend/src/index.css` — all colors
  are CSS variables at the top of the file), add your college/project title somewhere visible
- Hour 3-4: Full run-through of the demo script above at least 3 times so it's smooth
- Hour 4-5: Prepare answers for likely questions (see below) + write a short README/report if required
- Leave the last hour as buffer — something always goes wrong the first time

## Likely questions in a college evaluation (and where to point to)

- **"How is the password kept secure?"** → `authRoutes.js`, `bcrypt.hash()` — passwords are never
  stored in plain text, only a one-way hash.
- **"How does the server know who's logged in?"** → JWT: `authRoutes.js` signs a token on login,
  `middleware/auth.js` verifies it on every protected request.
- **"How do you stop a regular user from accessing admin features?"** → `adminOnly` middleware
  checks the role embedded in the token.
- **"What's the database schema?"** → three collections: `User`, `Service`, `Appointment` —
  Appointment references both a User and a Service by ID (this is what "relational" data looks
  like in MongoDB — via `ObjectId` references, not foreign keys).
- **"Why MERN?"** → one language (JavaScript) across the whole stack; MongoDB's flexible schema
  suits fast-changing student projects; React gives a responsive single-page app experience.

## Troubleshooting

- **"MongoDB connection failed"** → double check `.env`, especially password special characters
  (if your password has `@` or `#`, URL-encode it) and that your Atlas IP whitelist includes `0.0.0.0/0`.
- **Frontend shows network errors** → make sure the backend terminal is still running and shows
  port 5000; the frontend expects it at `http://localhost:5000` (set in `frontend/src/api/axios.js`).
- **"Cannot find module"** → you likely skipped `npm install` in that folder.

## Future Improvements

- Email/SMS reminders for upcoming appointments
- Online payment integration at time of booking
- Calendar sync (Google Calendar) for both customers and admin
- Customer reviews and ratings per service
- Recurring appointment support
