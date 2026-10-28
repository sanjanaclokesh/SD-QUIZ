@echo off
setlocal enabledelayedexpansion
title Push to GitHub - ArchIQ System Design Quiz

echo ========================================================
echo   Pushing ArchIQ to https://github.com/sanjanaclokesh/SD-QUIZ
echo ========================================================
echo.

:: Refresh environment PATH so git and gh are accessible
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
set "PATH=%SYS_PATH%;%USER_PATH%;%PATH%"

:: Check git status
git status >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Initializing git repository...
    git init -b main
    git remote add origin https://github.com/sanjanaclokesh/SD-QUIZ.git
)

:: Configure user name and email
git config user.name "sanjanaclokesh"
git config user.email "sanjana.c.iqac@snsgroups.com"

echo.
echo Choose authentication method:
echo   [1] Log in via Browser (Recommended - Opens GitHub login in your browser)
echo   [2] Paste a GitHub Personal Access Token (PAT)
echo   [3] Try direct push (if already authenticated)
echo.
set /p "CHOICE=Enter choice [1, 2, or 3]: "

if "%CHOICE%"=="1" (
    echo.
    echo Opening browser to authenticate with GitHub...
    gh auth login --web -p https -h github.com
    gh auth setup-git
    echo.
    echo Pushing code to main branch...
    git push -u origin main
) else if "%CHOICE%"=="2" (
    echo.
    echo Generate a token at: https://github.com/settings/tokens (select 'repo' scope)
    set /p "GH_PAT=Paste your GitHub Personal Access Token: "
    echo Pushing code using token...
    git push https://sanjanaclokesh:!GH_PAT!@github.com/sanjanaclokesh/SD-QUIZ.git main
) else (
    echo.
    echo Pushing code to main branch...
    git push -u origin main
)

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   SUCCESS! Your code has been pushed to:
    echo   https://github.com/sanjanaclokesh/SD-QUIZ
    echo ========================================================
) else (
    echo.
    echo Push encountered an error. If the repository already has commits on GitHub,
    echo run: git pull origin main --rebase and try pushing again.
)
echo.
pause
