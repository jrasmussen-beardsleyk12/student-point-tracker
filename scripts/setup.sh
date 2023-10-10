#!/bin/bash

# TODO: Pin all file downloads to the right version

curl -L "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/migrations/0001-initial-migration.sql" > "./sql/0001-initial-migration.sql"
curl -O -L "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/app.example.yaml"
curl -O -L "https://raw.githubusercontent.com/confused-Techie/student-point-tracker/main/docker-compose.yaml"

# Create a copy of the app.example.yaml
cp "./app.example.yaml" "./app.yaml"
