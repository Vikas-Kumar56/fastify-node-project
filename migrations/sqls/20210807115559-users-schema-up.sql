CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  password VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version UUID NOT NULL DEFAULT gen_random_uuid() /* don't add comma */
) /* dont add ; here */