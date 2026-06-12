# MANITOR AI - Database Schema

The primary relational data is stored in PostgreSQL. Below is the high-level schema for the system.

## Tables

### `users`
- `id` (UUID, PK)
- `clerk_id` (String, Unique)
- `email` (String, Unique)
- `name` (String)
- `created_at` (DateTime)

### `reminders`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `title` (String)
- `description` (Text)
- `due_date` (DateTime)
- `priority` (Enum)
- `is_recurring` (Boolean)

### `expenses`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `amount` (Decimal)
- `category_id` (UUID, FK)
- `date` (Date)
- `description` (String)

*(Schema extends to all 15+ modules following similar relational patterns)*
