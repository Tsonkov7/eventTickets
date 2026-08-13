# RavePass — Full-Stack Event Ticketing

> Browse events, build a cart, verify your account, and checkout with Stripe — server-validated orders and inventory.

![homepage](client/public/images/homepage-screenshot.png)

## Live demo

Deploy the backend (Render/Fly/Railway) and frontend (Vercel/Netlify), then add your URLs here.

## Features

- Event catalog with search and ticket selection
- Redux shopping cart with stock-aware quantity controls
- JWT authentication with email verification (Nodemailer)
- Protected routes on frontend and backend
- Stripe Payment Element checkout with **server-side price validation**
- Order persistence, inventory decrement, and confirmation emails
- Order history on profile page

## Tech stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, TypeScript, Vite, Redux Toolkit, Tailwind CSS, shadcn/ui, Stripe Elements |
| Backend | Node.js 20+, Express 5, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcryptjs, email verification |
| Payments | Stripe Payment Intents |

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Gmail app password (for email verification)
- Stripe test keys

### 1. Clone and install

```bash
git clone https://github.com/Tsonkov7/eventTickets
cd eventTickets

cd server && npm install
cd ../client && npm install
```

### 2. Environment variables

Copy the example files and fill in your values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

**Server** (`server/.env`):

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default 3000) |
| `MONGODB_CONNECTION_STRING` | MongoDB connection URI |
| `JWT_SECRET` | Secret for signing JWTs |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail credentials |
| `FRONTEND_URL` | Client URL for redirects |
| `SERVER_URL` | API URL for verification links |
| `STRIPE_SECRET_KEY` | Stripe secret key |

**Client** (`client/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

### 3. Seed sample events

```bash
cd server
node scripts/seed.js
```

### 4. Run locally

Terminal 1 — backend:

```bash
cd server
npm run dev
```

Terminal 2 — frontend:

```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Deployment

### Backend (Render / Fly / Railway)

1. Set all `server/.env` variables in the host dashboard.
2. Start command: `node index.js`
3. Ensure `FRONTEND_URL` points to your deployed client.

### Frontend (Vercel / Netlify)

1. Set `VITE_API_BASE_URL` to your deployed API URL.
2. Set `VITE_STRIPE_PUBLISHABLE_KEY`.
3. Build command: `npm run build`, output: `dist`.

## API overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/data` | — | List events |
| POST | `/auth/register` | — | Register user |
| POST | `/auth/login` | — | Login, returns JWT |
| GET | `/auth/verify/:token` | — | Email verification redirect |
| GET | `/users/profile` | JWT | User profile |
| GET | `/orders` | JWT | Order history |
| POST | `/payments/create-payment-intent` | JWT | Create Stripe intent (server-validated cart) |
| POST | `/payments/confirm` | JWT | Fulfill order after payment |

## Testing

```bash
cd server
npm test
```

## Challenges solved

- **Email verification gate** — users must verify before login
- **Server-side payment validation** — cart prices recomputed from DB, not trusted from client
- **Auth session persistence** — JWT rehydrated on page refresh with 401 interceptor
- **Idempotent order fulfillment** — duplicate confirm calls don't double-decrement inventory

## License

ISC
