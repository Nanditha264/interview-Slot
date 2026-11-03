# Interview Slot Booking API

A RESTful backend application built using Node.js and Express.js that allows recruiters to create and manage interview slots while enabling candidates to discover and book available interview schedules.

## 1. Project Overview

The Interview Slot Booking API is designed to simplify interview scheduling between recruiters and candidates.

Recruiters can publish interview slots with specific dates and durations. Candidates can view available slots and book suitable interview timings.

The system is designed around role-based access control, input validation, scheduling conflict prevention, and consistent API responses.

The primary objective is to build a modular, maintainable and reliable backend application following REST API development principles.

## 2. Problem Statement

Managing interview schedules manually can lead to several problems:

- Multiple candidates attempting to book the same slot.
- Recruiters accidentally creating overlapping interview schedules.
- Invalid interview dates or durations.
- Unauthorized users accessing restricted operations.
- Difficulty managing interview availability and cancellations.

This application addresses these challenges through a centralized REST API.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | REST API framework |
| JavaScript | Backend application logic |
| UUID | Unique identification of interview slots |
| CORS | Cross-Origin Resource Sharing |
| dotenv | Environment variable management |
| Swagger / OpenAPI | API documentation |
| Postman | API testing |
| Git | Version control |
| Nodemon | Automatic server restarting during development |

### Why these technologies?

**Node.js:** Provides a JavaScript runtime for building backend applications.

**Express.js:** Simplifies API development through routing, middleware and request handling.

**UUID:** Generates unique identifiers for interview slots.

**Postman:** Helps test API endpoints, request headers, request bodies and error responses.

**Git:** Tracks development progress through meaningful commits.

**Swagger:** Provides interactive API documentation and makes endpoints easier to understand and test.

## 4. System Architecture

The application follows a modular layered architecture.

### Request Flow

Client → Express Server → Authentication Middleware → Route → Controller → Service → Data Store → Response

### Architectural Components

**1. Server Layer**

Responsible for:
- Initializing the Express application.
- Configuring middleware.
- Registering API routes.
- Starting the HTTP server.

**2. Middleware Layer**

Responsible for:
- Reading authentication headers.
- Identifying user roles.
- Restricting access to protected endpoints.
- Handling application errors centrally.

**3. Routes Layer**

Defines API endpoints and connects requests to the appropriate controllers.

**4. Controller Layer**

Responsible for:
- Reading request parameters.
- Validating incoming requests.
- Calling service functions.
- Returning structured HTTP responses.

**5. Service Layer**

Contains business logic, including:
- Interview slot creation.
- Scheduling conflict detection.
- Slot filtering.
- Sorting and pagination.

**6. Data Store Layer**

Currently uses an in-memory JavaScript array to store interview slot records.

This approach keeps the implementation lightweight and avoids unnecessary database configuration during the initial development stage.

## 5. Project Structure

```text
interview-slot-booking-api/
│
├── src/
│   ├── config/
│   │   └── store.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   └── slotRoutes.js
│   │
│   ├── controllers/
│   │   └── slotController.js
│   │
│   ├── services/
│   │   └── slotService.js
│   │
│   ├── utils/
│   │   ├── validation.js
│   │   └── response.js
│   │
│   └── server.js
│
├── postman/
├── .gitignore
├── NOTES.md
├── README.md
└── package.json
```

## 6. Authentication and Authorization

The application currently uses header-based identity simulation.

Every protected request includes:

```http
x-user-id: recruiter-101
x-user-role: recruiter
```

Supported roles:

- recruiter
- candidate

Recruiters are authorized to create interview slots.

Candidates can access available interview slots.

The authorization middleware checks the user's role before allowing access to restricted operations.

**Note:** Header-based authentication is used for this assessment. It is not production-grade authentication. A production application should use verified authentication tokens or sessions.

## 7. API Endpoints

### 7.1 Create Interview Slot

**Method:** POST

**Endpoint:**

```http
POST /slots
```

**Access:** Recruiter only.

**Request Headers:**

```http
x-user-id: recruiter-101
x-user-role: recruiter
Content-Type: application/json
```

**Request Body:**

```json
{
  "startsAt": "2027-01-15T10:00:00+05:30",
  "durationMinutes": 30
}
```

**Validation Rules:**

- startsAt is required.
- startsAt must be a valid ISO 8601 date-time.
- The interview must be scheduled in the future.
- Duration must be an integer between 15 and 60 minutes.
- A recruiter cannot create overlapping active slots.

**Successful Response:** 201 Created.

### 7.2 List Interview Slots

**Method:** GET

**Endpoint:**

```http
GET /slots
```

**Access:** Recruiter and Candidate.

**Supported Query Parameters:**

| Parameter | Description |
|---|---|
| from | Filter slots starting from a date |
| to | Filter slots up to a date |
| status | Filter by slot status (recruiter only) |
| page | Page number |
| limit | Number of records per page |

**Example:**

```http
GET /slots?page=1&limit=10
```

**Date Filtering:**

```http
GET /slots?from=2027-01-01&to=2027-01-31
```

**Status Filtering:**

```http
GET /slots?status=open
```

**Role-Based Visibility:**

Recruiters can view their own slots, including their different statuses.

Candidates can view only future slots with open status.

**Sorting:**

Slots are sorted by start time in ascending order.

**Pagination Defaults:**

- Default page: 1
- Default limit: 10
- Maximum limit: 50

## 8. Business Rules

The application follows these scheduling rules:

1. Only recruiters can create interview slots.
2. Interview slots must have future start times.
3. Interview duration must be between 15 and 60 minutes.
4. A recruiter cannot have overlapping active interview slots.
5. Back-to-back interview slots are allowed.
6. Candidates should only see future available slots.
7. Recruiters should only manage their own slots.

Additional booking and cancellation rules will be documented when those features are implemented.

## 9. Slot Overlap Detection

The application uses an interval comparison algorithm to detect scheduling conflicts.

For two interview slots:

```text
Slot A: 10:00 AM - 10:30 AM
Slot B: 10:15 AM - 10:45 AM
```

These slots overlap and must not both be created for the same recruiter.

The mathematical condition is:

```text
A.start < B.end AND B.start < A.end
```

This approach allows back-to-back scheduling.

For example:

```text
Slot A: 10:00 AM - 10:30 AM
Slot B: 10:30 AM - 11:00 AM
```

These slots are valid because they do not overlap.

## 10. API Response Format

The application uses a consistent JSON response structure.

**Success Response:**

```json
{
  "success": true,
  "message": "Slots fetched successfully",
  "data": {}
}
```

**Error Response:**

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data"
}
```

## 11. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Access forbidden |
| 404 | Resource not found |
| 409 | Scheduling conflict |
| 500 | Internal server error |

## 12. Installation and Execution

### Prerequisites

- Node.js 18 or above.
- npm.
- Git.
- Postman.

### Clone Repository

```bash
git clone <repository-url>
cd interview-slot-booking-api
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

The application runs on:

```text
http://localhost:3000
```

## 13. Testing

The API is tested using Postman.

Important test scenarios include:

- Successful recruiter slot creation.
- Missing authentication headers.
- Invalid user roles.
- Candidate attempting recruiter-only operations.
- Invalid interview duration.
- Past interview dates.
- Overlapping recruiter schedules.
- Candidate slot visibility.
- Recruiter slot ownership.
- Date filtering.
- Pagination boundaries.
- Invalid query parameters.

Additional booking and cancellation test cases will be added after implementing those endpoints.

## 14. Current Storage Strategy

The current implementation uses an in-memory JavaScript array.

Advantages:
- Simple implementation.
- No database installation required.
- Fast development and testing.
- Suitable for demonstrating API business logic.

Limitations:
- Data is lost when the server restarts.
- Data is not shared across multiple server instances.
- It does not provide persistent storage or database transactions.

A persistent database such as MongoDB or PostgreSQL can be integrated for production deployment.

## 15. Future Improvements

- Persistent database integration.
- JWT-based authentication.
- Database transactions for booking consistency.
- Automated unit and integration testing.
- Rate limiting.
- Structured logging.
- Docker-based deployment.
- Production monitoring.

## 16. Conclusion

The Interview Slot Booking API demonstrates practical backend development concepts, including REST API design, middleware-based authorization, input validation, business logic separation, scheduling conflict detection, filtering and pagination.

The project is developed with a focus on clean architecture, understandable implementation and reliable request handling.

The implementation and documentation will be updated as additional booking, cancellation and testing features are completed.