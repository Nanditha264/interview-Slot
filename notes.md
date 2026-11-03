# Technical Implementation Notes

## 1. Project Objective

Build a backend REST API that manages interview scheduling between recruiters and candidates.

The application focuses on correct business logic, validation, authorization and predictable API behavior.

## 2. Design Decisions

### A. Why Express.js?

Express provides a lightweight framework for implementing HTTP routes and middleware without unnecessary complexity.

### B. Why Layered Architecture?

Separating routes, controllers, services and middleware provides:

- Better maintainability.
- Easier debugging.
- Reusable business logic.
- Clear separation of responsibilities.
- Easier testing.

### C. Why In-Memory Storage?

A JavaScript array is used to minimize setup time and focus on the scheduling logic.

This is an assessment-oriented implementation, not a persistent production database.

### D. Why UUID?

UUID provides unique identifiers for interview slots without relying on sequential IDs.

### E. Why Middleware?

Authentication and authorization are handled before requests reach protected controllers.

This avoids repeating access-control checks across every endpoint.

## 3. Scheduling Algorithm

The application compares the start and end times of existing slots.

For a new slot:

```javascript
const newEnd = new Date(
    start.getTime() + durationMinutes * 60000
);
```

For an existing slot:

```javascript
const existingEnd = new Date(
    existingStart.getTime() +
    slot.durationMinutes * 60000
);
```

Overlap condition:

```javascript
newStart < existingEnd &&
existingStart < newEnd
```

The algorithm checks existing slots belonging to the same recruiter.

Cancelled slots are excluded from overlap detection.

**Time Complexity:** O(n) per slot creation, where n is the number of stored slots.

## 4. Pagination Logic

The API uses:

```javascript
const total = result.length;

const startIndex = (page - 1) * limit;

const items = result.slice(
    startIndex,
    startIndex + limit
);
```

This ensures that pagination metadata represents the complete filtered result set.

**Time Complexity:** O(n log n) for sorting, followed by O(limit) result slicing, excluding the cost of copying the array.

## 5. Error Handling

The application uses centralized error-handling middleware.

Expected errors include:

- Missing authentication.
- Invalid roles.
- Invalid request parameters.
- Scheduling conflicts.
- Missing resources.
- Unexpected server errors.

The API returns meaningful HTTP status codes and structured JSON responses.

## 6. Important Security Considerations

The current header-based identity mechanism is only for assessment demonstration.

It does not verify whether a user actually owns the supplied identity.

Production implementation should include:

- Verified JWT authentication or secure sessions.
- Database-level authorization.
- Input sanitization.
- Request rate limiting.
- Secure configuration management.

## 7. Current Implementation Status

| Feature | Status |
|---|---|
| Express server | Implemented |
| In-memory storage | Implemented |
| Authentication middleware | Implemented |
| Role authorization | Implemented |
| Centralized error handling | Implemented |
| Standard response utility | Implemented |
| Recruiter slot creation | Implemented |
| Slot validation | Implemented |
| Overlap detection | Implemented |
| Slot listing | Implemented |
| Date filtering | Implemented |
| Status filtering | Implemented |
| Pagination | Implemented |
| Candidate booking | Pending |
| Booking concurrency protection | Pending |
| Cancellation | Pending |
| Swagger documentation | Pending |
| Postman collection | Pending |
| Final automated tests | Pending |

Update this table as each feature is completed.

## 8. Known Limitations

- Data is stored in memory and is not persistent.
- Authentication headers simulate user identity.
- Concurrent booking protection still needs implementation.
- Automated test coverage is not yet complete.

## 9. Development Principle

The implementation prioritizes correctness and clarity over unnecessary abstractions.

Every dependency should serve a specific requirement, and business rules should remain independent of HTTP request-handling logic.