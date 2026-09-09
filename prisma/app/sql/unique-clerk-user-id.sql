-- Unique Clerk identity on jotz.users (nullable unique: multiple NULLs still allowed).
-- Safe to run if the column already exists; skip if the index is already present.

CREATE UNIQUE INDEX IF NOT EXISTS users_clerk_user_id_key ON jotz.users (clerk_user_id);
