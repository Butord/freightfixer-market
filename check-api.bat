
@echo off
REM Script for checking API server availability on Windows

echo Checking API server...
echo API URL: %VITE_API_URL%

REM Set default if environment variable is not set
if "%VITE_API_URL%"=="" set VITE_API_URL=http://localhost:8000/api

echo Using API URL: %VITE_API_URL%

REM Check if curl is available
where curl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: curl command not found. Please install curl or add it to your PATH.
    goto :troubleshooting
)

REM Check HTTP connection using curl
echo.
echo Testing API connection...
curl -I "%VITE_API_URL%/healthcheck.php"

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

:troubleshooting
echo.
echo Troubleshooting steps:
echo 1. Run '.\check-api.bat' from the project root directory
echo 2. Make sure docker-compose is running: 'docker-compose ps'
echo 3. Restart containers: 'docker-compose down' and then 'docker-compose up -d'
echo 4. Check if port 8000 is being blocked by a firewall
echo 5. Ensure VITE_API_URL is set correctly in the .env file
echo 6. Try accessing %VITE_API_URL%/healthcheck.php in your browser
echo 7. If running alongside Denwer, make sure there are no port conflicts

pause
