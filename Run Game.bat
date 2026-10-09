@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>&1
if errorlevel 1 (
    where python >nul 2>&1
    if errorlevel 1 (
        echo Khong tim thay Python. Hay cai Python va them vao PATH.
        pause
        exit /b 1
    )
    set "PYTHON=python"
) else (
    set "PYTHON=py"
)

for /f %%P in ('powershell -NoProfile -Command "$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0); $listener.Start(); $port = $listener.LocalEndpoint.Port; $listener.Stop(); $port"') do set "PORT=%%P"
if not defined PORT (
    echo Khong the chon cong cho may chu game.
    pause
    exit /b 1
)

start "Flappy Bird server" cmd /k "%PYTHON% -m http.server %PORT% --bind 127.0.0.1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"