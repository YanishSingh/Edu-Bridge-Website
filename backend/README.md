# Edu-Bridge Backend API

Backend server for the Edu-Bridge educational consultancy website built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edubridge
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
```

3. **Create the first admin** (one-time): from the backend directory run:
   ```bash
   ADMIN_EMAIL=admin@edubridge.com ADMIN_PASSWORD=yourpassword node scripts/seedAdmin.js
   ```
   Or set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` and run `node scripts/seedAdmin.js`. Default is admin@edubridge.com / admin123.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
backend/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # MongoDB models
├── routes/          # API routes
├── index.js         # Server entry point
└── package.json
```

