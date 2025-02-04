# Car Rental Backend Repository

## Description

Car Rental Backend is a Node.js application built with Express.js.

## Prerequisites

Before running the project, ensure you have the following tools installed:

1. **GitHub**: Required to clone the project repository.
    - [Download GitHub](https://git-scm.com/downloads)

2. **Node.js**: Required for running the backend.
    - [Download Node.js](https://nodejs.org/)

3. **MongoDB**: Required for the database.
    - [Download MongoDB](https://www.mongodb.com/try/download/community)

4. **MongoDB Compass**: A GUI for viewing and interacting with your MongoDB database.
    - [Download MongoDB Compass](https://www.mongodb.com/try/download/compass)

## Project Architecture

This project follows the **MVC (Model-View-Controller)** design pattern:

- **Model**: Manages the database schema and handles data logic.
- **View**: There is no direct view in this project since it is a backend project. However, it provides APIs that a frontend application can consume.
- **Controller**: Handles the requests, processes the data, and sends responses to the client.

## Dependencies

- **bcrypt** (`^5.1.1`): A library to help hash passwords securely.
- **bcryptjs** (`^2.4.3`): A pure JavaScript version of bcrypt for environments where the native module is not available.
- **body-parser** (`^1.20.3`): Middleware to parse incoming request bodies in a middleware before handling them.
- **cookie-parser** (`^1.4.7`): Middleware to parse cookies attached to the client requests.
- **cors** (`^2.8.5`): Middleware for enabling Cross-Origin Resource Sharing (CORS).
- **dotenv** (`^16.4.7`): A zero-dependency module to load environment variables from a `.env` file into `process.env`.
- **express** (`^4.21.2`): A fast, unopinionated, and minimalist web framework for Node.js.
- **jsonwebtoken** (`^9.0.2`): An implementation of JSON Web Tokens (JWT) for secure token-based authentication.
- **mongoose** (`^8.8.4`): A MongoDB object modeling tool for Node.js, providing schema-based solutions.
- **morgan** (`^1.10.0`): A HTTP request logger middleware for Node.js.
- **node-cron** (`^3.0.3`): A task scheduling library for Node.js to run scheduled tasks.
- **nodemon** (`^3.1.7`): A utility that monitors for changes in your source code and automatically restarts your server.
- **razorpay** (`^2.9.5`): A library to integrate Razorpay payment gateway for online transactions.
- **validator** (`^13.12.0`): A library for string validation and sanitization.

## How to Install and Run the App

- **Clone the repository**: git clone https://github.com/Web-Tech-Team-5/backend
- **Change directory**: cd backend
- **Install dependencies**: npm install
- **Make sure .env is added and configured**: add .env in the project directory
- **Run the app**: 'npm run dev' in the terminal to run in development mode.

## Viewing the Database in MongoDB Compass

Once MongoDB is running locally, you can view the `carrentalcluster.tq6ww.mongodb.net` database using MongoDB Compass. Follow these steps:

1. **Open MongoDB Compass**: Make sure you have MongoDB Compass installed and open it.

2. **Connect to the Local MongoDB Instance**:
    - In the MongoDB Compass connection screen, enter the following connection string:
      ```
      mongodb+srv://team05:carrental@carrentalcluster.tq6ww.mongodb.net/
      ```

3. **View Collections**:
    - After connecting, you should see the `carrentalcluster.tq6ww.mongodb.net` database in the left sidebar.
    - Click on the database to explore the collections and documents stored inside.

