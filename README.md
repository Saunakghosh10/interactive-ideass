# Interactive Ideas Platform

A modern web application for sharing and collaborating on ideas.

## Features

- User authentication (Google OAuth)
- Create and manage ideas
- Real-time updates
- Responsive design

## Tech Stack

- Next.js 15
- TypeScript
- Prisma
- PostgreSQL
- NextAuth.js
- Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy .env.example to .env)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env` file in the root directory and add the following:

```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
