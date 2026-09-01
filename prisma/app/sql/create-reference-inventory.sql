-- Reference inventory for tagging notes with non-biblical works
-- (devotionals, commentaries, and user-defined types).
-- Run against DATABASE_URL (bibjotz), schema jotz.
-- Safe to re-run: tables use IF NOT EXISTS; seed skips names you already have.

CREATE TABLE IF NOT EXISTS jotz.reference_types (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES jotz.users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  normalized_name VARCHAR(80) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT reference_types_user_normalized_name_key UNIQUE (user_id, normalized_name)
);

CREATE INDEX IF NOT EXISTS reference_types_user_id_idx
  ON jotz.reference_types (user_id);

CREATE TABLE IF NOT EXISTS jotz."references" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES jotz.users(id) ON DELETE CASCADE,
  type_id INTEGER NOT NULL REFERENCES jotz.reference_types(id) ON DELETE RESTRICT,
  title VARCHAR(200) NOT NULL,
  normalized_title VARCHAR(200) NOT NULL,
  author VARCHAR(200),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT references_user_type_normalized_title_key UNIQUE (user_id, type_id, normalized_title)
);

CREATE INDEX IF NOT EXISTS references_user_id_idx
  ON jotz."references" (user_id);

CREATE INDEX IF NOT EXISTS references_type_id_idx
  ON jotz."references" (type_id);

CREATE TABLE IF NOT EXISTS jotz.note_references (
  id SERIAL PRIMARY KEY,
  note_id INTEGER NOT NULL REFERENCES jotz.notes(id) ON DELETE CASCADE,
  reference_id INTEGER NOT NULL REFERENCES jotz."references"(id) ON DELETE CASCADE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT note_references_note_id_reference_id_key UNIQUE (note_id, reference_id)
);

CREATE INDEX IF NOT EXISTS note_references_reference_id_idx
  ON jotz.note_references (reference_id);

-- Seed built-in types for every existing reader. Safe to re-run.
INSERT INTO jotz.reference_types (user_id, name, normalized_name)
SELECT u.id, seed.name, lower(seed.name)
FROM jotz.users u
CROSS JOIN (
  VALUES
    ('Devotional'),
    ('Commentary'),
    ('Other')
) AS seed(name)
WHERE NOT EXISTS (
  SELECT 1
  FROM jotz.reference_types existing
  WHERE existing.user_id = u.id
    AND existing.normalized_name = lower(seed.name)
);
