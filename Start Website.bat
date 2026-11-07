@echo off
title Vangogh Website - keep this window open
cd /d "%~dp0"
echo.
echo  Starting the Vangogh Productions website...
echo  Your browser will open automatically.
echo  Keep this window open while you view the site. Close it to stop.
echo.
call npm.cmd run dev -- --open
echo.
echo  The website has stopped. Press any key to close this window.
pause >nul
