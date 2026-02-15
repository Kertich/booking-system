# Booking App – Backend

This is the backend API for the Booking App system.

It provides authentication and booking management functionality using:

- Node.js
- Express
- Supabase (Database + Authentication)
- Row-Level Security (RLS)
- JWT-based route protection

Only authenticated users can create, view, and delete their own bookings.

## Tech Stack

- Node.js
- Express.js
- Supabase (PostgreSQL + Auth)
- JWT (via Supabase access_token)
- CORS

## Authentication Flow

1. Client sends email + password to `/api/auth/login`
2. Backend authenticates user using Supabase
3. Backend returns `access_token`
4. Client sends token in Authorization header:
   Authorization: Bearer <token>
5. Protected routes validate token using Supabase

## Security Features

- Supabase authentication
- JWT validation on protected routes
- Row-Level Security (RLS) enabled
- Users can only access their own bookings
- CORS restricted to frontend origin

## API Endpoints

### Authentication

POST /api/auth/login
- Logs in a user
- Returns access_token

---

### Bookings

GET /api/bookings
- Returns bookings belonging to authenticated user

POST /api/bookings
- Creates a new booking for authenticated user
- Prevents duplicate time slots

DELETE /api/bookings/:id
- Cancels a booking
- Only allows deletion if booking belongs to authenticated user

## Database Schema

Table: bookings

- id (uuid or serial primary key)
- user_id (uuid, foreign key to auth.users)
- date (date)
- time_slot (text)
- status (optional, default: pending)
- created_at (timestamp)

## Row-Level Security

RLS policies ensure:

- Users can only SELECT their own bookings
- Users can only INSERT bookings linked to their user_id
- Users can only DELETE their own bookings

## Installation

1. Clone the repository

git clone https://github.com/Kertich/booking-system

2. Install dependencies

npm install

3. Create a `.env` file

## Environment Variables

Create a `.env` file:

SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
PORT=5000

## Run Server

npm run dev

Server runs on:
http://localhost:5000


