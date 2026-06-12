# MANITOR AI - API Documentation

The backend utilizes FastAPI to serve a RESTful architecture with automatic OpenAPI documentation.

## Base URL
`/api/v1`

## Endpoints

### Authentication (Handled via Clerk middleware)
- `POST /api/v1/users/sync` - Syncs Clerk user data.

### Reminders
- `GET /api/v1/reminders/` - List reminders.
- `POST /api/v1/reminders/` - Create a reminder.
- `PUT /api/v1/reminders/{id}` - Update a reminder.

### Expenses
- `GET /api/v1/expenses/` - List expenses.
- `POST /api/v1/expenses/` - Add an expense.

### MONI AI
- `POST /api/v1/ai/chat/` - Send a message to MONI and get a response.
