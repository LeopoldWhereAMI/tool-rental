CREATE TEMP TABLE temp_auth_users (
  id uuid,
  email text,
  encrypted_password text,
  created_at timestamptz,
  updated_at timestamptz
);

\copy temp_auth_users(id,email,encrypted_password,created_at,updated_at)
FROM 'C:/Users/karab/OneDrive/Рабочий стол/coding/rent-app/migration/auth_users.csv'
CSV HEADER;

INSERT INTO users (
  id,
  email,
  password,
  created_at,
  updated_at
)
SELECT
  id,
  email,
  encrypted_password,
  created_at,
  updated_at
FROM temp_auth_users;