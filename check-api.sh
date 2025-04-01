
#!/bin/bash

# Script for checking API server availability

echo "Checking API server..."
echo "API URL: ${VITE_API_URL:-http://localhost:8000/api}"

# Check HTTP connection
curl -I "${VITE_API_URL:-http://localhost:8000/api}/healthcheck.php" 2>/dev/null | head -n 1

# If curl doesn't work, try wget
if [ $? -ne 0 ]; then
  echo "curl failed, trying wget..."
  wget -q --spider "${VITE_API_URL:-http://localhost:8000/api}/healthcheck.php"
  if [ $? -eq 0 ]; then
    echo "API available via wget!"
  else
    echo "API unavailable. Make sure the server is running."
  fi
fi

# Check Docker containers
echo -e "\nChecking Docker containers:"
docker ps | grep -E 'frontend|backend|database'

# Check backend container logs
echo -e "\nChecking backend container logs (last 10 lines):"
docker-compose logs --tail=10 backend

echo -e "\nChecking frontend container logs (last 10 lines):"
docker-compose logs --tail=10 frontend

echo -e "\nTroubleshooting steps:"
echo "1. Run 'docker-compose down' and then 'docker-compose up -d'"
echo "2. Check if port 8000 is being blocked by a firewall"
echo "3. Ensure VITE_API_URL is set correctly in the .env file"
echo "4. Try accessing ${VITE_API_URL:-http://localhost:8000/api}/healthcheck.php in your browser"
echo "5. If running alongside Denwer, make sure there are no port conflicts"
