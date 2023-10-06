
CREATE EXTENSION pgcrypto;

CREATE TABLE students (
  student_id BIGINT NOT NULL PRIMARY KEY,
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  points BIGINT NOT NULL DEFAULT 0,
  duck_string VARCHAR(17) NOT NULL DEFAULT '10000000000000053',
  duck_unlocked VARCHAR NOT NULL DEFAULT 'hat:00;eyes:00;beak:00;wings:00;accessories:00;body:00;item:00;beakColor:5;bodyColor:3;'
);

CREATE TYPE pointsAction AS ENUM('added', 'removed');

CREATE TABLE points (
  point_id UUID DEFAULT GEN_RANDOM_UUID() PRIMARY KEY,
  student BIGINT NOT NULL REFERENCES students(student_id),
  points_modified BIGINT NOT NULL DEFAULT 0,
  points_action pointsAction NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  points_before BIGINT NOT NULL,
  points_after BIGINT NOT NULL,
  reason VARCHAR(256)
);

-- Badges and Junction Tables --

CREATE TABLE badges (
  serial VARCHAR(128) NOT NULL PRIMARY KEY,
  requirement JSONB NOT NULL,
  image VARCHAR(128) NOT NULL
);

CREATE TABLE badges_students (
  badge_serial VARCHAR(128) REFERENCES badges(serial),
  student_id BIGINT REFERENCES students(student_id),
  achieved TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- constraints
  CONSTRAINT badges_students_pk PRIMARY KEY(badge_serial,student_id)
);
