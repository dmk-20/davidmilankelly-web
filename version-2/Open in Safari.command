#!/bin/bash
# Version 2 — serves from parent MY WEBSITE folder so Photo/ and WebM/ load.
cd "$(dirname "$0")/.."
PORT=8766
echo "Starting server at http://localhost:$PORT/version-2/"
python3 -m http.server $PORT &
SERVER_PID=$!
sleep 1.5
echo "Opening Safari (Version 2). Press Ctrl+C here to stop the server."
open -a Safari "http://localhost:$PORT/version-2/"
wait $SERVER_PID
