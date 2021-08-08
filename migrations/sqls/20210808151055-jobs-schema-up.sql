CREATE TABLE jobs (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 title TEXT NOT NULL,
 description TEXT NOT NULL,
 skills TEXT NOT NULL,
 min_budget VARCHAR(20) NOT NULL,
 max_budget VARCHAR(20) NOT NULL, 
 expired_at DATE NOT NULL DEFAULT CURRENT_DATE, /* YYYY-MM-DD */
 user_id UUID NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 version UUID NOT NULL DEFAULT gen_random_uuid(),
 CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id)
)