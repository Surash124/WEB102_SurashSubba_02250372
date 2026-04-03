# Connecting a Backend to Postgres

## Project Overview
This project explains how to connect a Node.js backend directly to a PostgreSQL database without using an ORM. It covers database setup, connection testing, and creating REST API endpoints for student records.

## Technology Stack
· Framework: Node.js + Express  
· Database: PostgreSQL  
· Middleware: CORS, Express JSON parser  
· Form Handling: Express JSON body parsing  
· Data Fetching: PostgreSQL client (`pg` library)

## Setup Instructions
1. Create the database in PostgreSQL:  
   `CREATE DATABASE student_records;`  
   Add a `students` table and insert sample data.  
2. Clone the repository:  
   `git clone https://github.com/username/db-connection.git`  
3. Install dependencies:  
   `npm install`  
4. Start the server:  
   `node server.js`  
5. Open http://localhost:5000/api/students in the browser.

## Application Structure
· **db-test.js**: Script to test database connection and run queries.  
· **server.js**: Express server with REST endpoints for students.  
· **Database**: Connection pool created with `pg`.  
· **Routes**: `/api/students` for fetching and adding student records.

## Key Components
· `Pool` (pg): Manages PostgreSQL connections.  
· `db-test.js`: Verifies connection and prints student data.  
· `server.js`: Defines API endpoints (`GET /api/students`, `POST /api/students`).  

## Authentication Flow
Authentication is not included in this project. All endpoints are public for simplicity. In a real application, authentication would be added to protect database operations.

## Features Implemented
· Connect Node.js backend to PostgreSQL using `pg`.  
· Test database connection with sample queries.  
· REST API endpoints:  
   - `GET /api/students` → Fetch all students  
   - `POST /api/students` → Add a new student with validation  
· Error handling for duplicate emails and failed queries.  
