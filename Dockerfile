# syntax=docker/dockerfile:1
FROM node:18-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifest to the container image.
COPY package*.json ./

# Copy local code to the container image.
COPY . ./

# install production dependencies
RUN npm install --only-production

# Create a volume that can be used by hosters
VOLUME /usr/src/app/storage

# Copy files we want users to have access too, or need to share with the db
#COPY ./app.example.yaml /usr/src/app/storage/app.example.yaml
#COPY ./migrations/ /usr/src/app/storage/sql/

# Setup our HealthCheck
HEALTHCHECK CMD node ./scripts/healthCheck.js

# Expose the port we can listen on by default
EXPOSE 8080

# Run the web service on container startup
CMD [ "npm", "start" ]
