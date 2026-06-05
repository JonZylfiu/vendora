# Vendora

Vendora is a distributed marketplace where users can buy and sell items. This repository contains the TypeScript Express API that supports user authentication, item listings with image uploads, bids, orders, notifications, and user account management.

## Tech Stack

- Node.js
- Express 
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Multer for item image uploads
- Helmet, CORS, and Express rate limiting

## Project Structure

```text
src/
  app.ts                 Express app entry point
  config/                Database and upload configuration
  controllers/           HTTP request handlers
  dtos/                  Request and response DTO types
  enums/                 Shared enum values
  errors/                Custom error classes
  mapper/                Model-to-response mapping helpers
  middleware/            Auth, validation, rate limit, and error middleware
  models/                Mongoose models and interfaces
  routes/                API route definitions
  services/              Business logic
  types/                 Shared TypeScript types
  utils/                 Shared helpers
dist/                    Compiled JavaScript output
uploads/items/           Uploaded item images
```

## Requirements

- Node.js
- npm
- MongoDB database

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/vendora
JWT_SECRET=replace-with-a-secure-secret
SALT_ROUNDS=10
```

`PORT` is optional and defaults to `3000`. The other values are required by the database connection, JWT helpers, and password hashing.

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

The source is compiled from `src/` into `dist/`.

## Run

```bash
npm run build
npm run dev
```

The `dev` script runs `nodemon ./dist/app.js`, so rebuild after TypeScript changes.

When the server starts, it listens at:

```text
http://localhost:3000
```

or the port configured in `.env`.

## API Documentation

Swagger UI is available after starting the server:

```text
http://localhost:3000/api-docs
```

The raw OpenAPI document is available at:

```text
http://localhost:3000/api-docs.json
```

Use the **Authorize** button in Swagger UI with a bearer token from the login or register endpoint to test protected routes.

## Authentication

Most routes require a bearer token:

```http
Authorization: Bearer <jwt-token>
```

Tokens are returned by the register and login endpoints.

## API Routes

Base URL:

```text
/api
```

### Auth

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |

Register body:

```json
{
  "name": "test",
  "surname": "test",
  "email": "test@example.com",
  "password": "Password123!",
  "city": "Prishtina",
  "phone": "+38344123456",
  "age": 24,
  "location": [21.1659, 42.6629]
}
```

### Items

All item routes require authentication.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/items` | List items |
| `GET` | `/api/items/:id` | Get one item |
| `POST` | `/api/items` | Create an item |
| `PATCH` | `/api/items/:id` | Update an item |
| `PATCH` | `/api/items/:id/restore` | Restore an archived item |
| `PATCH` | `/api/items/:id/archive` | Archive an item |
| `PATCH` | `/api/items/:id/sold` | Mark an item as sold |
| `DELETE` | `/api/items/:id` | Delete an item |

Item listing query parameters:

| Parameter | Description |
| --- | --- |
| `category` | Filter by item category |
| `city` | Filter by seller city |
| `search` | Search title and description |
| `state` | Filter by item state |
| `page` | Page number, defaults to `1` |
| `limit` | Page size, defaults to `10`, max `30` |

Creating and updating items accepts `multipart/form-data` with up to five image files in the `images` field.

Required create fields:

```text
title
description
startingPrice
state
category
tags
images
```

### Bids

All bid routes require authentication.

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/bids` | Create a bid |
| `GET` | `/api/bids/item/:itemId` | List bids for an item |
| `GET` | `/api/bids/:bidId` | Get one bid |
| `PATCH` | `/api/bids/:bidId` | Update a bid amount |
| `DELETE` | `/api/bids/:bidId` | Delete a bid |

Create bid body:

```json
{
  "itemId": "item-id",
  "amount": 150
}
```

### Orders

All order routes require authentication.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/orders` | List the authenticated user's orders |
| `GET` | `/api/orders/:id` | Get one order |
| `POST` | `/api/orders` | Create an order |
| `PATCH` | `/api/orders/:id/status` | Update order state |
| `DELETE` | `/api/orders/:id` | Delete an order |

Order states:

```text
CONFIRMED
SHIPPED
RECEIVED
CANCELLED
```

### Notifications

All notification routes require authentication.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/notifications` | List notifications for the authenticated user |
| `DELETE` | `/api/notifications/:id` | Delete a notification |

### Users

All user routes require authentication.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/users` | List users |
| `GET` | `/api/users/:id` | Get one user |
| `PATCH` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user account |

## Domain Values

Item states:

```text
AVAILABLE
SOLD
ARCHIVED
```

Item categories:

```text
ELECTRONICS, FASHION, HOME, BEAUTY, SPORTS, BOOKS, TOYS, AUTOMOTIVE,
GAMING, PHONES, COMPUTERS, FURNITURE, PETS, MUSIC, HEALTH, FOOD,
BABY, JEWELRY, OFFICE, OTHER
```

User cities are restricted to the Kosovo city values defined in `src/enums/cities.enum.ts`.

## Uploaded Files

Item images are stored under:

```text
uploads/items/
```

Only image MIME types are accepted. Each file is limited to 5 MB.

