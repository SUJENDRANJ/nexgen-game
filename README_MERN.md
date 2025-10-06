# Gamification Platform - MERN Stack

A gamification platform built with MongoDB, Express, React, and Node.js (MERN stack) with real-time updates via WebSockets.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher) running locally or remotely

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Copy `.env.example` to `.env` and update if needed:
```bash
cp .env.example .env
```

3. Start MongoDB:
```bash
# If using local MongoDB
mongod
```

4. Seed the database:
```bash
npm run seed
```

This will create:
- Admin user: `admin@gmail.com` / `admin@123`
- Demo users with sample data
- Sample achievements and rewards

5. Start the development server:
```bash
npm run dev
```

This will start both:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

## Login Credentials

### Admin Account
- Email: `admin@gmail.com`
- Password: `admin@123`

### Demo Users
- Email: `john@example.com` / Password: `password123`
- Email: `sarah@example.com` / Password: `password123`
- Email: `mike@example.com` / Password: `password123`

## Features

- **Authentication**: Simple email/password authentication
- **Real-time Updates**: WebSocket-based real-time leaderboard and notifications
- **Achievements**: Create and award achievements to users
- **Rewards**: Marketplace where users can redeem rewards with points
- **Leaderboard**: Real-time ranking of all users by points
- **Admin Dashboard**: Manage achievements, rewards, and users

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register a new user

### Achievements
- `GET /api/achievements` - Get all achievements
- `POST /api/achievements` - Create a new achievement (admin only)
- `POST /api/achievements/award/:achievementId` - Award achievement to user
- `DELETE /api/achievements/:id` - Delete an achievement

### Rewards
- `GET /api/rewards` - Get all rewards
- `POST /api/rewards` - Create a new reward (admin only)
- `POST /api/rewards/purchase/:rewardId` - Purchase a reward
- `DELETE /api/rewards/:id` - Delete a reward

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard (all users sorted by points)

## Real-time Events

The application uses Socket.IO for real-time updates:
- `achievementCreated` - New achievement added
- `achievementAwarded` - Achievement awarded to user
- `achievementDeleted` - Achievement removed
- `rewardCreated` - New reward added
- `rewardPurchased` - Reward purchased by user
- `rewardDeleted` - Reward removed

## Project Structure

```
project/
├── server/
│   ├── models/          # MongoDB models
│   │   ├── User.ts
│   │   ├── Achievement.ts
│   │   └── Reward.ts
│   ├── routes/          # API routes
│   │   ├── auth.ts
│   │   ├── achievements.ts
│   │   ├── rewards.ts
│   │   └── leaderboard.ts
│   ├── middleware/      # Auth middleware
│   ├── db.ts           # Database connection
│   ├── index.ts        # Express server
│   └── seed.ts         # Database seeder
├── src/
│   ├── components/     # React components
│   ├── context/        # React context
│   ├── lib/           # API and Socket.IO clients
│   └── types.ts       # TypeScript types
└── package.json
```

## Scripts

- `npm run dev` - Start both backend and frontend in dev mode
- `npm run server` - Start only the backend server
- `npm run seed` - Seed the database with demo data
- `npm run build` - Build frontend for production
- `npm run typecheck` - Run TypeScript type checking

## Notes

- MongoDB must be running before starting the server
- All users appear in the leaderboard with real-time updates
- Admin account is created automatically when seeding with email `admin@gmail.com`
- Points are awarded when achievements are unlocked
- Stock levels decrease when rewards are purchased
