# FleetOps — Complete Build Guide
### A Full Logistics/Fleet Management System (MERN Stack) — Free Tools Only

This is your complete spec: what to build, in what order, with what schema, using what tools — all free. Follow it top to bottom. Don't skip the "why" notes; you'll need them in interviews.

---

## 1. Project Overview

**FleetOps** is a fleet and delivery operations management platform. It lets an admin/dispatcher manage drivers, vehicles, and delivery routes, while drivers get a simplified view to update the status of their assigned deliveries. It solves the same core problem real logistics companies have: coordination currently happens manually (calls, spreadsheets) with no shared visibility, no accountability trail, and no reporting.

### Core Users (Roles)
1. **Admin** — full access: manage drivers, vehicles, routes, view analytics, assign deliveries
2. **Dispatcher** *(optional, can merge into Admin for MVP)* — creates and assigns routes/deliveries
3. **Driver** — sees only their assigned deliveries, updates status, uploads proof of delivery

---

## 2. Full Feature List

### MVP (build this first — this alone is a complete, demoable project)
- [ ] User authentication (register/login) with roles (Admin, Driver)
- [ ] Admin: CRUD for Drivers
- [ ] Admin: CRUD for Vehicles
- [ ] Admin: CRUD for Routes/Deliveries, assign a driver + vehicle to each
- [ ] Driver: view only their own assigned deliveries
- [ ] Driver: update delivery status (Pending → In Transit → Delivered / Failed)
- [ ] Proof-of-delivery image upload (Cloudinary)
- [ ] Admin dashboard with basic charts (deliveries by status, deliveries per driver)
- [ ] Search + filter on deliveries table (by status, driver, date)
- [ ] CSV export of delivery records

### Stretch Features (add after MVP works end-to-end)
- [ ] Email notifications (delivery assigned, status changed) — Nodemailer
- [ ] Activity log (who changed what, when) — audit trail collection
- [ ] Live map view of delivery locations (Leaflet.js + OpenStreetMap — free, no API key needed)
- [ ] Route optimization (basic — sort stops by distance using the Haversine formula, no paid API needed)
- [ ] Real-time status updates via WebSockets (Socket.io) instead of polling
- [ ] Driver mobile-friendly PWA view
- [ ] Rate limiting + basic analytics on API usage

---

## 3. Tech Stack (100% Free)

| Layer | Tool | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev server, modern standard |
| Styling | Tailwind CSS | Fast styling, no separate CSS files |
| Frontend state | React Context or Redux Toolkit | Manage auth/user state globally |
| Server state/data fetching | TanStack Query (optional but recommended) | Caching, auto-refetch, loading states |
| Backend | Node.js + Express | Standard MERN backend |
| Database | MongoDB Atlas (Free Tier — M0) | 512MB free forever, no credit card required |
| Auth | JWT + bcrypt | Stateless auth, free, no third-party service needed |
| File storage | Cloudinary (Free Tier) | 25 credits/month free, image hosting + transformation |
| Email | Nodemailer + Gmail SMTP (free) or Brevo free tier (300 emails/day free) | No cost for low volume |
| Maps (stretch) | Leaflet.js + OpenStreetMap tiles | Completely free, no API key, unlike Google Maps |
| Charts | Recharts or Apache ECharts | Free, open-source |
| Hosting (frontend) | Vercel (Free Tier) | Free for personal projects |
| Hosting (backend) | Render (Free Tier) | Free web service tier (spins down when idle — fine for a demo) |
| Version control | GitHub | Free public/private repos |

No paid service is required anywhere in this stack.

---

## 4. Database Schema (MongoDB / Mongoose)

### User
```js
{
  name: String, required,
  email: String, required, unique,
  password: String, required (hashed with bcrypt),
  role: { type: String, enum: ["admin", "driver"], default: "driver" },
  phone: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: Date,
  updatedAt: Date
}
```

### Vehicle
```js
{
  plateNumber: String, required, unique,
  type: String, enum: ["van", "truck", "bike", "car"],
  capacityKg: Number,
  status: { type: String, enum: ["available", "in_use", "maintenance"], default: "available" },
  assignedDriver: { type: ObjectId, ref: "User", default: null },
  createdAt: Date
}
```

### Route (a container for one trip — can hold multiple delivery stops)
```js
{
  name: String,                     // e.g. "Downtown Morning Route"
  driver: { type: ObjectId, ref: "User" },
  vehicle: { type: ObjectId, ref: "Vehicle" },
  status: { type: String, enum: ["planned", "active", "completed", "cancelled"], default: "planned" },
  scheduledDate: Date,
  startedAt: Date,
  completedAt: Date,
  createdBy: { type: ObjectId, ref: "User" },  // admin who created it
  createdAt: Date
}
```

### Delivery (individual stop within a route)
```js
{
  route: { type: ObjectId, ref: "Route" },
  customerName: String,
  address: String,
  location: { lat: Number, lng: Number },   // for map view later
  status: { type: String, enum: ["pending", "in_transit", "delivered", "failed"], default: "pending" },
  proofImageUrl: String,             // Cloudinary URL, set when marked delivered
  notes: String,
  sequenceOrder: Number,              // stop order within the route
  deliveredAt: Date,
  createdAt: Date
}
```

### ActivityLog (stretch feature — audit trail)
```js
{
  user: { type: ObjectId, ref: "User" },
  action: String,          // e.g. "UPDATED_DELIVERY_STATUS"
  targetType: String,      // e.g. "Delivery"
  targetId: ObjectId,
  details: Object,         // e.g. { from: "pending", to: "in_transit" }
  createdAt: Date
}
```

**Relationships summary:**
- One `User` (driver) → many `Route`s
- One `Route` → many `Delivery`s (embedded reference, not nested — deliveries are their own collection so they can be queried/filtered independently)
- One `Vehicle` → assigned to one driver at a time

---

## 5. API Endpoint Design

### Auth
```
POST   /api/auth/register        (admin creates driver accounts, or open registration for MVP)
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me              (get current logged-in user)
```

### Users / Drivers (Admin only, except /me)
```
GET    /api/users?role=driver          (list all drivers)
GET    /api/users/:id
POST   /api/users                      (create driver — admin only)
PATCH  /api/users/:id
DELETE /api/users/:id
```

### Vehicles (Admin only)
```
GET    /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles
PATCH  /api/vehicles/:id
DELETE /api/vehicles/:id
```

### Routes
```
GET    /api/routes                      (admin: all; driver: only their own — filtered by req.user.id)
GET    /api/routes/:id
POST   /api/routes                      (admin only — creates route + assigns driver/vehicle)
PATCH  /api/routes/:id                  (admin only — update status, reassign)
DELETE /api/routes/:id                  (admin only)
```

### Deliveries
```
GET    /api/deliveries?routeId=&status=&driverId=&date=     (filters via query params)
GET    /api/deliveries/:id
POST   /api/deliveries                  (admin only — add a stop to a route)
PATCH  /api/deliveries/:id/status       (driver — update their own delivery's status)
PATCH  /api/deliveries/:id              (admin — edit details)
DELETE /api/deliveries/:id              (admin only)
POST   /api/deliveries/:id/proof        (driver — upload proof-of-delivery image via Cloudinary)
GET    /api/deliveries/export           (CSV export, admin only)
```

### Dashboard / Analytics
```
GET    /api/analytics/summary           (counts: total deliveries, by status, active drivers, active routes)
GET    /api/analytics/deliveries-by-driver
GET    /api/analytics/deliveries-over-time
```

### Activity Log (stretch)
```
GET    /api/logs?targetType=&userId=
```

---

## 6. Step-by-Step Build Order

Build in this exact order — each phase produces something demoable, so if you run out of time, you still have a working project.

### Phase 1 — Project Setup
1. Create GitHub repo, init with README
2. Set up backend: `npm init`, install `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `cookie-parser`
3. Set up frontend: `npm create vite@latest` (React + TypeScript template), install `tailwindcss`, `axios`, `react-router-dom`
4. Create MongoDB Atlas free cluster, get connection string, store in backend `.env`
5. Confirm backend connects to MongoDB (simple `console.log` on successful connection)
6. Confirm frontend can hit a test backend route (`GET /api/health` → `{ status: "ok" }`)

### Phase 2 — Auth
7. Build `User` model + registration/login controllers (hash password with bcrypt, issue JWT)
8. Build auth middleware: verify JWT from cookie, attach `req.user`
9. Build role-check middleware: `requireRole("admin")`
10. Build frontend: Register/Login pages, store auth state (Context or Redux), protected route wrapper
11. Test: register an admin, register a driver, confirm login works and role is stored correctly

### Phase 3 — Core CRUD (Drivers & Vehicles)
12. Build Vehicle model + full CRUD API (admin-only, protected by role middleware)
13. Build frontend: Admin page listing drivers, add/edit/delete driver (uses the User model, filtered by role)
14. Build frontend: Admin page listing vehicles, add/edit/delete
15. Test full CRUD flow in the browser for both

### Phase 4 — Routes & Deliveries (core feature)
16. Build Route model + CRUD API
17. Build Delivery model + CRUD API, including the `PATCH /status` endpoint restricted so drivers can only update their own deliveries
18. Build frontend: Admin — create a route, assign driver + vehicle, add delivery stops to it
19. Build frontend: Driver dashboard — shows only routes/deliveries assigned to the logged-in driver
20. Build frontend: Driver can update delivery status via buttons/dropdown
21. Test the full flow: admin creates a route with 2–3 stops → driver logs in → sees the route → updates statuses one by one

### Phase 5 — File Upload (Proof of Delivery)
22. Set up free Cloudinary account, get API key/secret, store in `.env`
23. Build `POST /api/deliveries/:id/proof` — accepts image, uploads to Cloudinary, saves URL to the Delivery document
24. Build frontend: when driver marks a delivery "Delivered," prompt for a photo upload
25. Test: upload an image, confirm it shows up on the admin's delivery detail view

### Phase 6 — Dashboard & Analytics
26. Build `/api/analytics/summary` using MongoDB aggregation (`$group`, `$count`)
27. Build frontend admin dashboard: cards for total deliveries/active routes/active drivers, plus 1–2 charts (Recharts) — e.g., deliveries by status (pie/bar), deliveries over time (line)
28. Add search/filter to the deliveries table (by status, driver name, date range) — implement via query params on the GET endpoint

### Phase 7 — CSV Export
29. Build `GET /api/deliveries/export` — query all matching deliveries, convert to CSV (use a lightweight package like `json2csv`), send as a file download
30. Add an "Export CSV" button on the admin deliveries page

### Phase 8 — Polish & Deploy
31. Add loading states, error handling, and empty states throughout the frontend
32. Add basic input validation on all forms (frontend) and all endpoints (backend)
33. Write a clean README: problem statement, features, tech stack, setup instructions, screenshots
34. Deploy backend to Render (free tier), frontend to Vercel (free tier), confirm environment variables are set correctly on both, test the live deployed version end-to-end

### Phase 9 — Stretch Features (only if time allows, in priority order)
35. Email notifications on delivery assignment/status change (Nodemailer + free Gmail SMTP or Brevo)
36. Activity log — log every status change/create/delete to an `ActivityLog` collection, show it on an admin "Activity" page
37. Map view — plug delivery `location` coordinates into a Leaflet.js map, show markers for each stop
38. Real-time updates — swap polling for Socket.io so the admin dashboard updates live when a driver changes a status

---

## 7. Folder Structure

```
fleetops/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Route.js
│   │   ├── Delivery.js
│   │   └── ActivityLog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── vehicleController.js
│   │   ├── routeController.js
│   │   ├── deliveryController.js
│   │   └── analyticsController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── deliveryRoutes.js
│   │   └── analyticsRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js       (verify JWT)
│   │   ├── roleMiddleware.js       (requireRole)
│   │   └── errorMiddleware.js
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         (shared UI: Button, Table, Modal, StatusBadge, etc.)
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Drivers.tsx
│   │   │   │   ├── Vehicles.tsx
│   │   │   │   ├── Routes.tsx
│   │   │   │   └── Deliveries.tsx
│   │   │   └── driver/
│   │   │       └── MyDeliveries.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── api/
│   │   │   └── axiosInstance.ts     (base Axios config, auth headers)
│   │   ├── routes/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 8. Environment Variables Needed

**backend/.env**
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email (if using Nodemailer)
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 9. Security Checklist (don't skip — this is often what separates a "student project" from an "internship-ready project")

- [ ] Passwords hashed with bcrypt, never stored/logged in plain text
- [ ] JWT stored in an HTTP-only cookie (not localStorage) to reduce XSS risk
- [ ] CORS configured to only allow your frontend's origin, with `credentials: true`
- [ ] All admin-only routes protected by role middleware, not just hidden in the UI
- [ ] Input validation on every POST/PATCH endpoint (required fields, correct types, enum checks)
- [ ] `.env` file added to `.gitignore` — never commit secrets
- [ ] Rate limiting on auth routes (e.g., `express-rate-limit`, free) to slow down brute-force login attempts

---

## 10. What to Say This Project Demonstrates (for your resume/interview)

- Full-stack MERN development with role-based access control
- RESTful API design with proper resource modeling and relationships
- MongoDB schema design, including one-to-many relationships via references
- File upload handling with a third-party cloud service
- Authentication and authorization (JWT, bcrypt, middleware-based protection)
- Dashboard/analytics implementation using MongoDB aggregation
- Deployment of a full-stack app using free-tier cloud hosting

---

## Final Notes

- Build phases 1–7 fully before touching any stretch feature — a complete MVP beats a half-built version with fancy extras.
- Test each phase in the browser before moving to the next; don't stack unverified layers.
- Keep commits granular and meaningful (e.g., "Add driver CRUD endpoints", not one giant "final project" commit) — commit history is sometimes reviewed.
- Once built, go back to your MERN interview prep guide and swap in your real implementation details for the "hardest bug" and "what I'd improve" questions.
