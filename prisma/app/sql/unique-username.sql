-- Unique usernames (multiple NULLs still allowed in Postgres).
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON jotz.users (username);
