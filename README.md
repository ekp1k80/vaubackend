REST API with Express and TypeScript

This project is a REST API built using Express, TypeScript, and PostgreSQL. It provides routes for user registration, login, and user listing, with JWT-based authentication. The database is managed via a migration script.

Features

User Registration: Register users with hashed passwords.

User Login: Authenticate users and issue JWT tokens via cookies.

Protected Routes: Use JWT for secure access to the user listing.

Database Integration: PostgreSQL for data persistence.

TypeScript: Static typing for robust and maintainable code.

Prerequisites

Node.js (v16 or later)

PostgreSQL (v12 or later)

npm (v7 or later)

Setup Instructions

1. Clone the Repository

git clone <repository-url>
cd <repository-directory>

2. Install Dependencies

npm install

3. Configure Environment Variables

Create a .env file in the root of the project and configure the following variables:

PORT=3000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

4. Initialize the Database

Ensure your PostgreSQL server is running.

Run the migration script to create the users table:

npx ts-node migrate_users_table.ts

5. Run the Server

Start the development server:

npm run dev

The server will start on http://localhost:3000.

API Endpoints

1. POST /register

Register a new user.

Request Body:

{
  "username": "exampleUser",
  "email": "example@example.com",
  "password": "password123"
}

Response:

201 Created: User registered successfully.

400 Bad Request: Missing required fields.

500 Internal Server Error: Database or server error.

2. POST /login

Authenticate a user and issue a JWT token.

Request Body:

{
  "email": "example@example.com",
  "password": "password123"
}

Response:

200 OK: Login successful, token stored as a cookie.

401 Unauthorized: Invalid credentials.

3. GET /users

Fetch a list of all users. Protected by JWT authentication.

Headers:

Cookie with a valid token.

Response:

200 OK: Returns a list of users.

401 Unauthorized: Missing or invalid token.

500 Internal Server Error: Database or server error.

Scripts

npm run dev: Start the server in development mode with TypeScript.

npm run build: Compile the TypeScript files to JavaScript.

npm start: Start the compiled JavaScript server.

Project Structure

.
├── src
│   ├── index.ts            # Entry point of the application
│   ├── migrate_users_table.ts # Migration script for creating the users table
├── package.json
├── tsconfig.json           # TypeScript configuration
├── .env                    # Environment variables

Troubleshooting

Cannot connect to the database:

Ensure PostgreSQL is running and the DATABASE_URL is correct.

SyntaxError: Cannot use import statement outside a module:

Add "type": "module" to package.json or use ts-node to run TypeScript files.

Error: Invalid Token:

Ensure the token cookie is present and valid.

License

This project is licensed under the MIT License.