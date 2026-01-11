@echo off
REM ============================================
REM EngineersTech Project Build Script (Windows)
REM Creates a deployment-ready package
REM ============================================

echo Building EngineersTech Project...

REM Create build directory
if exist build rmdir /s /q build
mkdir build

echo Installing dependencies...
call npm install

echo Building frontend...
call npm run build

echo Copying files...

REM Copy built frontend
xcopy /s /e /y dist\* build\

REM Copy API
mkdir build\api
xcopy /s /e /y api\* build\api\

REM Copy migrations
mkdir build\database
xcopy /s /e /y migrations\* build\database\

REM Create uploads directory
mkdir build\api\uploads

REM Create .htaccess for SPA routing
(
echo RewriteEngine On
echo RewriteBase /
echo.
echo # Don't rewrite API requests
echo RewriteRule ^api/ - [L]
echo.
echo # Serve existing files directly
echo RewriteCond %%{REQUEST_FILENAME} -f [OR]
echo RewriteCond %%{REQUEST_FILENAME} -d
echo RewriteRule ^ - [L]
echo.
echo # SPA fallback
echo RewriteRule ^ index.html [L]
) > build\.htaccess

echo Creating ZIP archive...
cd build
powershell Compress-Archive -Path * -DestinationPath ..\engineerstech-deploy.zip -Force
cd ..

echo.
echo ============================================
echo Build complete!
echo Deployment package: engineerstech-deploy.zip
echo ============================================
echo.
echo Upload and extract on your web server to deploy.
pause
