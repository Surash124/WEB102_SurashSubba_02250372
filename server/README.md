# Project Overview
This project is a RESTful API backend for a TikTok-like application. It provides endpoints for videos, users, and comments, designed to integrate with a Next.js frontend. The API supports CRUD operations, likes/unlikes, and follow/unfollow functionality.

## Technology Stack
- Framework: Node.js + Express
- Middleware: Morgan (logging), CORS (cross-origin requests), Body-Parser (request parsing)
- Styling: Not applicable (backend only)
- Form Handling: Body-Parser for JSON and URL-encoded requests
- Data Fetching: In-memory datastore (src/models/index.js)

## Setup Instructions
1. Clone the repository  
   `git clone https://github.com/username/tiktok-api.git`
2. Install dependencies  
   `npm install`
3. Start development server  
   `npm run dev`
4. Open http://localhost:3000

## Application Structure
- **Controllers**: Logic for videos, users, and comments  
- **Routes**: REST endpoints grouped by resource (videos, users, comments)  
- **Middleware**: JSON-only content negotiation, error handling  
- **Models**: In-memory datastore for users, videos, and comments  

## Key Components
- `videoController`: CRUD operations for videos, plus likes/unlikes and comments retrieval  
- `userController`: CRUD operations for users, plus followers/following management  
- `commentController`: CRUD operations for comments, plus likes/unlikes  

## Authentication Flow
Authentication is simulated using request body or headers (e.g., `userId`). No full authentication system is implemented, but the structure allows easy integration later.

## Features Implemented
- CRUD endpoints for videos, users, and comments  
- Like/unlike functionality for videos and comments  
- Follow/unfollow functionality for users  
- Error handling and validation for missing or invalid data  
