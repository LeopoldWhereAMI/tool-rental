# deploy.ps1
# Полный цикл: сборка -> подготовка standalone -> упаковка -> заливка на сервер -> деплой
# Запуск: .\deploy.ps1

$ErrorActionPreference = "Stop"
$ServerIP = "194.87.94.197"
$ServerPath = "/opt/masterskaya46"

function Write-Step($msg) {
    Write-Host ""
    Write-Host "==> $msg" -ForegroundColor Cyan
}

Write-Step "1/7 Сборка проекта (prisma generate + next build)"
npm run build

Write-Step "2/7 Копирование внешних пакетов и статики в standalone"
$standalone = ".next/standalone"

Remove-Item -Recurse -Force "$standalone/node_modules/pg" -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force "node_modules/pg" "$standalone/node_modules/pg"

Remove-Item -Recurse -Force "$standalone/node_modules/@prisma/client" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$standalone/node_modules/@prisma/adapter-pg" -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force "node_modules/@prisma/client" "$standalone/node_modules/@prisma/client"
Copy-Item -Recurse -Force "node_modules/@prisma/adapter-pg" "$standalone/node_modules/@prisma/adapter-pg"

Remove-Item -Recurse -Force "$standalone/src/generated/prisma" -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force -Path "$standalone/src/generated" | Out-Null
Copy-Item -Recurse -Force "src/generated/prisma" "$standalone/src/generated/prisma"

Copy-Item -Recurse -Force ".next/static" "$standalone/.next/static"
if (Test-Path "public") {
    Copy-Item -Recurse -Force "public" "$standalone/public"
}

Write-Step "3/7 Очистка dev-артефактов (иначе архив раздувается до сотен МБ)"
Remove-Item -Recurse -Force ".next/dev" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".next/cache" -ErrorAction SilentlyContinue

Write-Step "4/7 Упаковка архива"
if (Test-Path "rent-app-build.tar.gz") {
    Remove-Item "rent-app-build.tar.gz"
}
tar -czf rent-app-build.tar.gz .next

$sizeMB = [math]::Round((Get-Item "rent-app-build.tar.gz").Length / 1MB, 1)
Write-Host "Размер архива: $sizeMB MB" -ForegroundColor Yellow
if ($sizeMB -gt 150) {
    Write-Host "ВНИМАНИЕ: архив подозрительно большой (>150MB)." -ForegroundColor Red
    Write-Host "Проверь, не попал ли в него .next/dev или другой мусор." -ForegroundColor Red
    $confirm = Read-Host "Продолжить заливку всё равно? (y/n)"
    if ($confirm -ne "y") {
        Write-Host "Остановлено пользователем." -ForegroundColor Red
        exit 1
    }
}

Write-Step "5/7 Заливка архива на сервер"
scp rent-app-build.tar.gz "root@${ServerIP}:${ServerPath}/"

Write-Step "6/7 Запуск атомарного деплоя на сервере"
ssh "root@${ServerIP}" "bash ${ServerPath}/deploy.sh"

Write-Step "7/7 Готово"
Write-Host "Проверь сайт: http://${ServerIP}:3000" -ForegroundColor Green
