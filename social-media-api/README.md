# Project Overview
This project is a RESTful API built with Node.js and Express to simulate a social media platform similar to Instagram. It provides endpoints for managing users, posts, comments, likes, and followers. The API demonstrates proper HTTP methods, status codes, error handling, and content negotiation (JSON/XML).

## Technology Stack
- Framework: Node.js + Express
- Middleware: Morgan (logging), Helmet (security), CORS (cross-origin requests)
- Styling: Not applicable (backend only)
- Form Handling: Express JSON body parser
- Data Fetching: In-memory mock data (utils/mockData.js)

## Setup Instructions
1. Clone the repository  
   `git clone https://github.com/username/social-media-api.git`
2. Install dependencies  
   `npm install`
3. Start development server  
   `npm run dev`
4. Open http://localhost:3000

## Application Structure
- **Controllers**: Handle business logic for each resource (users, posts, etc.)  
- **Routes**: Define REST endpoints grouped by resource  
- **Middleware**: Error handling, async wrapper, content negotiation  
- **Utils**: Mock data and error response utilities  

## Key Components
- `userController`: CRUD operations for users with validation  
- `postController`: CRUD operations for posts, ownership checks for updates/deletes  
- `formatResponse`: Middleware to support JSON and XML responses  

## Authentication Flow
Authentication is simulated using request headers (e.g., `X-User-Id`). Protected routes check ownership before allowing updates or deletions. This keeps the API simple but demonstrates how authentication logic can be integrated.

## Features Implemented
- CRUD endpoints for users and posts  
- Error handling middleware with custom responses  
- Content negotiation (JSON/XML)  
- API documentation served via `/api-docs`  
