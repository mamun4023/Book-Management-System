# Book Management System (NestJS + Mongoose)

A simple REST API built with NestJS 11 and Mongoose for managing Authors and Books. It includes validation, pagination, filtering, and basic CRUD operations.

## Tech Stack

- **Runtime**: Node 22
- **Framework**: NestJS 11
- **Database**: MongoDB via Mongoose
- **Validation**: class-validator, class-transformer
- **Testing**: Jest, @nestjs/testing

## Features

- **Authors**: create, list, get, update, delete
- **Books**: create, list (with pagination/filtering), get, update, delete
- **Validation**: Global `ValidationPipe` (whitelist, forbid non-whitelisted, transform)
- **Timestamps**: `createdAt`, `updatedAt` on documents

## Getting Started

### Prerequisites

- Node 22+
- A running MongoDB instance (local or cloud)

### Environment

Create a `.env` file in the project root:

```
MONGO_URI=mongodb://localhost:27017/book_mgmt
PORT=3000
```

### Install

```
npm install
```

### Run

```
# development
npm run start:dev

# production
npm run build && npm run start:prod
```

The API will run on `http://localhost:${PORT || 3000}`.

### Test

```
npm run test
```

## Project Structure (key parts)

- `src/app.module.ts` – root module, loads Config + Mongo connection
- `src/main.ts` – bootstraps Nest app, sets global ValidationPipe
- `src/author/*` – Author module (schema, service, controller, DTOs)
- `src/book/*` – Book module (schema, service, controller, DTOs)

## Data Models (simplified)

### Author

- `firstName: string` (required)
- `lastName: string` (required)
- `bio?: string`
- `birthDate?: Date`

### Book

- `title: string` (required)
- `isbn: string` (required, unique, format: `978-3-16-148410-0`)
- `publishedDate?: Date`
- `genre?: string` (example enum: Fantasy | Science Fiction | Thriller)
- `author: ObjectId` (required, ref Author)

## API Reference

Base URL: `http://localhost:3000`

### Authors

- `POST /authors`
  - Body:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "…",
      "birthDate": "1990-01-01"
    }
    ```
  - Response: `{ success, message, data }`

- `GET /authors`
  - Response: `{ success, message, data: Author[] }`

- `GET /authors/:id`
  - Validates `:id` as ObjectId
  - Response: `{ success, message, data }`

- `PATCH /authors/:id`
  - Body: partial of create payload
  - Response: `{ success, message, data }`

- `DELETE /authors/:id`
  - Response: `{ success, message }`

### Books

- `POST /books`
  - Body:
    ```json
    {
      "title": "My Book",
      "isbn": "978-3-16-148410-0",
      "publishedDate": "2024-01-01",
      "genre": "Fantasy",
      "author": "<authorObjectId>"
    }
    ```
  - Response: `{ success, message, data }`

- `GET /books`
  - Query:
    - `page` (default 1)
    - `limit` (default 10)
    - `genre` (optional)
    - `author` (optional, ObjectId string)
    - `search` (optional, matches title case-insensitively)
  - Response:
    ```json
    {
      "success": true,
      "message": "Books fetched successfully",
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0,
      "data": []
    }
    ```

- `GET /books/:id`
  - Validates `:id` as ObjectId
  - Response: `{ success, message, data }`

- `PATCH /books/:id`
  - Body: partial of create payload
  - Response: `{ success, message, data }`

- `DELETE /books/:id`
  - Response: `{ success, message, data }`

## Validation Behavior

Global `ValidationPipe` is configured with:

- `whitelist: true` – strips unknown fields
- `forbidNonWhitelisted: true` – throws on unknown fields
- `transform: true` – auto-transforms payloads to DTO types

Validation errors return HTTP 400 with details from NestJS.

## Notes

- Ensure MongoDB indexes are created for unique fields (e.g., `isbn`).
- Controllers validate `:id` via `mongoose.Types.ObjectId.isValid` and return 400 on invalid IDs.

## License

UNLICENSED (see `package.json`).

