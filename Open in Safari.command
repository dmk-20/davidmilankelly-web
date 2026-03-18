#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
echo "Starting server at http://localhost:$PORT"
python3 -m http.server $PORT &
SERVER_PID=$!
sleep 1.5
echo "Opening Safari; video loops should start as soon as the page loads."
open -a Safari "http://localhost:$PORT/"
wait $SERVER_PID
