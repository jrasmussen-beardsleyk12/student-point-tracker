
CREATE EXTENSION pgcrypto;

CREATE TABLE students (
  student_id BIGINT NOT NULL PRIMARY KEY,
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  points BIGINT NOT NULL DEFAULT 0,
  duck_string VARCHAR(17) NOT NULL DEFAULT '10000000000000053',
  duck_unlocked VARCHAR NOT NULL DEFAULT 'hat:00,03;eyes:00,01;beak:00;wings:00;accessories:00,05;body:00;item:00,02;beakColor:5;bodyColor:3;'
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

CREATE TABLE badges_earned (
  instance_id UUID DEFAULT GEN_RANDOM_UUID() PRIMARY KEY,
  student_id BIGINT REFERENCES students(student_id),
  badge_id VARCHAR(128) NOT NULL,
  achieved TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP--,
  -- constraints
  --CONSTRAINT badges_students_pk PRIMARY KEY(badge_id, student_id)
);
