@echo off
echo ========================================
echo  Deploy Supabase Edge Function
echo  Usando NPX (sem instalar CLI)
echo ========================================
echo.

echo ℹ️  Usando npx supabase (Node.js necessário)
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Baixe em: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

REM Perguntar pela API key
set /p API_KEY="Cole sua Claude API Key (sk-ant-api...): "

if "%API_KEY%"=="" (
    echo.
    echo ❌ API Key necessária!
    pause
    exit /b 1
)

echo.
echo 🔐 Fazendo login no Supabase...
echo.

npx supabase login

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Falha no login!
    pause
    exit /b 1
)

echo.
echo 🔗 Linkando projeto...
echo.

npx supabase link --project-ref vwzgreramlxwzmtbhchl

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Falha ao linkar!
    pause
    exit /b 1
)

echo.
echo 🔑 Configurando API Key...
echo.

npx supabase secrets set CLAUDE_API_KEY=%API_KEY%

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Falha ao configurar secret!
    pause
    exit /b 1
)

echo.
echo 🚀 Fazendo deploy da Edge Function...
echo.

npx supabase functions deploy claude-proxy

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ DEPLOY CONCLUÍDO COM SUCESSO!
    echo ========================================
    echo.
    echo Sua Edge Function está disponível em:
    echo https://vwzgreramlxwzmtbhchl.supabase.co/functions/v1/claude-proxy
    echo.
    echo ✅ Teste agora em: https://iandre.web.app
    echo.
    echo O chat funcionará sem erro de CORS!
    echo.
) else (
    echo.
    echo ❌ Falha no deploy!
    echo.
    echo Verifique os logs: npx supabase functions logs claude-proxy
    echo.
)

pause
