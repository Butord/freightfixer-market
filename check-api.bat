
@echo off
REM Script for checking API server availability on Windows

echo Checking API server...
echo API URL: %VITE_API_URL%

REM Set default if environment variable is not set
if "%VITE_API_URL%"=="" set VITE_API_URL=http://localhost:8000/api

echo API URL: %VITE_API_URL%

REM Check HTTP connection using curl
curl -I "%VITE_API_URL%/healthcheck.php" 2>nul

REM Check Docker containers
echo.
echo Checking Docker containers:
docker ps | findstr /I "frontend backend database"

REM Check backend container logs
echo.
echo Checking backend container logs (last 10 lines):
docker-compose logs --tail=10 backend

echo.
echo Checking frontend container logs (last 10 lines):
docker-compose logs --tail=10 frontend

echo.
echo Troubleshooting steps:
echo 1. Run 'docker-compose down' and then 'docker-compose up -d'
echo 2. Check if port 8000 is being blocked by a firewall
echo 3. Ensure VITE_API_URL is set correctly in the .env file
echo 4. Try accessing %VITE_API_URL%/healthcheck.php in your browser
echo 5. If running alongside Denwer, make sure there are no port conflicts
