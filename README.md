# GOATCAST

A podcast-like platform for curated YouTube videos, built with Next.js and TypeScript. It features a curated collection of approved podcasts organized by genre, with an admin panel for managing submissions.

## Features

- **Curated Content**: Browse a collection of hand-picked, high-quality YouTube podcasts.
- **Genre Organization**: Podcasts are categorized into genres for easy discovery.
- **Podcast Submission**: Users can submit YouTube video URLs for new podcasts.
- **Admin Dashboard**: A secure, password-protected admin panel to review, approve, and reject new podcast submissions.
- **Automated Metadata**: The application automatically fetches video title, thumbnail, and description from YouTube.
- **Responsive Design**: Works on both desktop and mobile devices.
- **Modern UI**: Clean, minimalist interface built with Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **ORM**: Prisma
- **Auth**: Custom cookie-based authentication for the admin panel
- **API Integration**: Google's YouTube Data API v3 for fetching video details

## Getting Started

###Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- A MongoDB database
- A YouTube Data API Key

###Installation

1. Clone the repository:
```
Bash
git clone https://github.com/<your-username>/goatcast.git
cd goatcast
```

2. Install dependencies:
```
Bash
npm install
# or yarn install
# or pnpm install
```

4. Set up environment variables:
```
Create a .env file in the root directory and add the following:

DATABASE_URL="your_mongodb_connection_string"
YOUTUBE_API_KEY="your_youtube_api_key"
ADMIN_EMAIL="your_admin_email"
ADMIN_PASSWORD="your_admin_password"
```

5. Seed the database with initial data:
```
Bash
npm run seed
```

6. Run the development server:
```
Bash
npm run dev
```

7. Open http://localhost:3000 in your browser to see the application.

## Usage

1. **Homepage (/)**: Browse approved podcasts by genre.
2. **Genre Pages (/genre/[slug])**: View all podcasts within a specific genre.
3. **Request Page (/request)**: Submit a new podcast for review. The app will fetch the video details from YouTube and add it to the pending queue.
4. **Admin Login (/login)**: Log in to the admin dashboard.
5. **Admin Dashboard (/admin)**: Review pending podcasts and approve or reject them.

## Project Structure
```
.
├── prisma/             # Prisma schema and seed script
├── public/             # Static assets like images and svgs
├── src/
│   ├── app/            # Next.js App Router pages and API routes
│   │   ├── admin/      # Admin dashboard page
│   │   ├── api/        # API routes for podcast submission, admin actions, and authentication
│   │   ├── components/ # Reusable React components
│   │   ├── genre/      # Dynamic genre pages
│   │   ├── login/      # Admin login page
│   │   ├── request/    # Podcast submission page
│   │   └── ...
│   └── lib/            # Utility functions (e.g., Prisma client)
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
├── README.md           # This file
└── ...
```

## Key Components & API Endpoints

- **HomePage**: Fetches and displays approved podcasts from the database, grouped by genre.
- **RequestPage**: A client-side form for submitting a YouTube URL.
- **AdminDashboard**: A client-side page that fetches and displays a list of pending podcasts.
- **POST /api/request**: Receives a YouTube URL, genre, and description from the user then use the YouTube Data API to validate the URL and fetch video title and thumbnail. Creates a new podcast entry in the database with isApproved: false.
- **GET /api/request**: Used by the admin dashboard to retrieve a list of all pending podcast submissions.
- **PATCH /api/admin/podcasts/[id]**: Approves a pending podcast by setting isApproved: true.
- **DELETE /api/admin/podcasts/[id]**: Rejects and deletes a podcast submission.
- **POST /api/auth/admin**: Authenticates an admin user and sets a secure cookie.
- **DELETE /api/auth/admin**: Deletes the authentication cookie, logging the admin out.
- **middleware.ts**: Protects the /admin routes by checking for the admin authentication cookie.

## Development

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code linting.
- `npm run seed`: Populates the database with initial sample data.

## Code Style

The project uses ESLint for code linting and follows TypeScript best practices.
