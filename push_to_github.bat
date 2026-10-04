@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ========================================================
echo   AutoVroom - رفع المشروع الى GitHub
echo ========================================================
echo.
echo جاري الرفع الى https://github.com/hpop95298-dotco/aoutovroom.git ...
echo.
git push -u origin main --force
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   [نجاح] تم رفع جميع ملفات الاختبار بنجاح الى GitHub!
    echo   يمكنك الآن فتح Vercel والضغط على Deploy.
    echo ========================================================
) else (
    echo ========================================================
    echo   [تنبيه] إذا طلب منك GitHub تسجيل الدخول، اضغط Sign in with your browser
    echo ========================================================
)
echo.
pause
