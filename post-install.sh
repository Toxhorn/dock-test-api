#!/bin/bash

echo "Running Database Migrations..."
npx prisma migrate dev --name init

echo "Starting API..."
npm run start-dev
