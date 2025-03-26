# Subscription API

A production-ready RESTful API for managing subscription services with automated renewal reminders and JWT based secure authentication with email activation system.

## Features

- **User Authentication**
  - JWT-based secure authentication
  - Email activation system
  - Multi-role authorization (user, admin, editor, etc.)
  
- **Subscription Management**
  - Create and manage subscription plans
  - Track renewal dates and payment information
  - Handle subscription status changes

- **Automated Reminder Workflow**
  - Scheduled email notifications for upcoming renewals
  - Configurable reminder intervals (7, 5, 2, and 1 day before renewal)
  - Serverless workflow management with Upstash

- **Security**
  - Password encryption
  - Protection against brute force attacks
  - Input validation and sanitization
  - Rate limiting

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Upstash Workflow for scheduled tasks
- Nodemailer for email delivery
- DayJS for date manipulation

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/signin` - Authenticate user and get token
- `POST /api/v1/auth/signout` - Sign out user
- `GET /api/v1/auth/activate/:token` - Activate user account

### Users

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users/:id` - Get specific user
- `POST /api/v1/users` - Create new user (admin only)
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Subscriptions

- `GET /api/v1/subscriptions` - Get all user subscriptions
- `GET /api/v1/subscriptions/:id` - Get specific subscription
- `POST /api/v1/subscriptions` - Create new subscription
- `PUT /api/v1/subscriptions/:id` - Update subscription
- `DELETE /api/v1/subscriptions/:id` - Delete subscription

### Workflow

- `POST /api/v1/workflows/subscription/reminder` - Handle subscription reminders