@echo off
echo ========================================
echo  Deploy Supabase Edge Function
echo  Claude API Proxy
echo ========================================
echo.

REM Verificar se Supabase CLI está instalado
set SUPABASE_CMD=%SUPABASE_CMD%

REM Tentar CLI local primeiro
if exist "%~dp0.%SUPABASE_CMD%-cli\%SUPABASE_CMD%.exe" (
    set SUPABASE_CMD=%~dp0.%SUPABASE_CMD%-cli\%SUPABASE_CMD%.exe
    echo 📍 Usando Supabase CLI local
) else (
    REM Tentar CLI global
    where %SUPABASE_CMD% >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Supabase CLI não encontrado!
        echo.
        echo Execute: install-%SUPABASE_CMD%-cli.bat
        echo Ou visite: https://github.com/%SUPABASE_CMD%/cli#install
        echo.
        pause
        exit /b 1
    )
)

echo ✅ Supabase CLI encontrado
echo.

REM Verificar se está linkado ao projeto
echo 🔗 Verificando link com projeto...
%SUPABASE_CMD% link --project-ref vwzgreramlxwzmtbhchl 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️ Projeto não linkado. Linkando agora...
    %SUPABASE_CMD% link --project-ref vwzgreramlxwzmtbhchl
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ Falha ao linkar projeto!
        pause
        exit /b 1
    )
)

echo ✅ Projeto linkado
echo.

REM Perguntar pela API key
set /p CONFIGURE_KEY="Deseja configurar/atualizar a Claude API Key? (S/N): "
if /i "%CONFIGURE_KEY%"=="S" (
    echo.
    echo 🔑 Configure a API Key da Claude
    echo.
    echo Obtenha sua key em: https://console.anthropic.com/settings/keys
    echo.
    set /p API_KEY="Cole sua API key (sk-ant-api...): "

    if not "!API_KEY!"=="" (
        echo.
        echo 📝 Configurando secret...
        %SUPABASE_CMD% secrets set CLAUDE_API_KEY=!API_KEY!
        if !ERRORLEVEL! EQU 0 (
            echo ✅ Secret configurado com sucesso!
        ) else (
            echo ❌ Falha ao configurar secret
            pause
            exit /b 1
        )
    )
)

echo.
echo 🚀 Fazendo deploy da Edge Function...
echo.

%SUPABASE_CMD% functions deploy claude-proxy

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ DEPLOY CONCLUÍDO COM SUCESSO!
    echo ========================================
    echo.
    echo Sua Edge Function está disponível em:
    echo https://vwzgreramlxwzmtbhchl.%SUPABASE_CMD%.co/functions/v1/claude-proxy
    echo.
    echo Teste agora em: https://iandre.web.app
    echo.
) else (
    echo.
    echo ❌ Falha no deploy!
    echo.
    echo Verifique os logs: %SUPABASE_CMD% functions logs claude-proxy
    echo.
)

pause
