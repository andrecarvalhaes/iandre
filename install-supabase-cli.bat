@echo off
echo ========================================
echo  Download Supabase CLI
echo ========================================
echo.

REM Criar pasta local para o CLI
set INSTALL_DIR=%~dp0.supabase-cli
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo 📥 Baixando Supabase CLI...
echo.

REM URL do executável Windows (versão mais recente)
REM Use uma versão específica conhecida que funciona
set DOWNLOAD_URL=https://github.com/supabase/cli/releases/download/v2.1.0/supabase_2.1.0_windows_amd64.tar.gz

REM Baixar usando PowerShell
powershell -Command "& {Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%INSTALL_DIR%\supabase.zip'}"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Falha ao baixar!
    echo.
    echo Baixe manualmente em:
    echo https://github.com/supabase/cli/releases/latest
    echo.
    pause
    exit /b 1
)

echo ✅ Download concluído!
echo.

REM Extrair ZIP usando PowerShell
echo 📦 Extraindo...
powershell -Command "& {Expand-Archive -Path '%INSTALL_DIR%\supabase.zip' -DestinationPath '%INSTALL_DIR%' -Force}"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Falha ao extrair!
    pause
    exit /b 1
)

echo ✅ Extraído com sucesso!
echo.

REM Limpar arquivo ZIP
del "%INSTALL_DIR%\supabase.zip"

REM Adicionar ao PATH da sessão atual
set PATH=%INSTALL_DIR%;%PATH%

REM Testar
echo 🧪 Testando instalação...
echo.

"%INSTALL_DIR%\supabase.exe" --version

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ INSTALAÇÃO CONCLUÍDA!
    echo ========================================
    echo.
    echo Supabase CLI instalado em:
    echo %INSTALL_DIR%
    echo.
    echo Para usar em outras janelas:
    echo 1. Adicione ao PATH do sistema, OU
    echo 2. Use sempre a partir desta pasta
    echo.
    echo Execute agora: deploy-edge-function.bat
    echo.
) else (
    echo.
    echo ❌ Falha ao instalar!
    echo.
    echo Tente baixar manualmente:
    echo https://github.com/supabase/cli/releases/latest
    echo.
)

pause
