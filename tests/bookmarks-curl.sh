#!/bin/bash

if [ -z "$BOOKMARKS_TOKEN" ]; then
  echo "BOOKMARKS_TOKEN not set. Attempting to obtain token via login..."
  RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username": "curltestuser", "password": "new_secret"}')
  BOOKMARKS_TOKEN=$(python3 -c "import sys, json; j = json.load(sys.stdin); print(j.get('token', ''))" <<< "$RESPONSE")
  if [ -z "$BOOKMARKS_TOKEN" ]; then
    echo "Failed to obtain token. Exiting."
    exit 1
  fi
  echo "Obtained token: $BOOKMARKS_TOKEN"
fi

echo "Testing GET bookmarks endpoint..."
curl -s -X GET http://localhost:3000/api/multi/bookmarks -H "Authorization: Bearer $BOOKMARKS_TOKEN"
echo -e "\n"

echo "Testing POST bookmarks endpoint..."
curl -s -X POST http://localhost:3000/api/multi/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BOOKMARKS_TOKEN" \
  -d '{"url": "https://example.com", "title": "Example Bookmark", "description": "Test bookmark"}'
echo -e "\n"
