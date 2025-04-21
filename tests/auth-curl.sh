#!/bin/bash

echo "Testing registration endpoint..."
curl -s -X POST http://localhost:3000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{"username": "curltestuser", "email": "curltest@example.com", "password": "secret"}'
echo -e "\n"

echo "Testing login endpoint..."
curl -s -X POST http://localhost:3000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{"username": "curltestuser", "password": "secret"}'
echo -e "\n"

echo "Testing logout endpoint..."
curl -s -X POST http://localhost:3000/api/auth/logout \
 -H "Content-Type: application/json"
echo -e "\n"

echo "Testing reset-password endpoint..."
curl -s -X POST http://localhost:3000/api/auth/reset-password \
 -H "Content-Type: application/json" \
 -d '{"username": "curltestuser", "oldPassword": "secret", "newPassword": "new_secret"}'
echo -e "\n"
