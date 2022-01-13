DROP TABLE IF EXISTS quizzes CASCADE;
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id),
  subject VARCHAR (255) NOT NULL,
  description VARCHAR (255) NOT NULL,
  public BOOLEAN DEFAULT TRUE
);