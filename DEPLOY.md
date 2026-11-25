## Deploy on ssh

## Вариант 1

Деплой запускать командой .\deploy.ps1
Он сам сделает всё: сборку, копирование Prisma/pg в standalone, очистку dev-мусора, упаковку (с проверкой размера архива — предупредит, если снова раздуется за 150 МБ), заливку по scp и запуск deploy.sh на сервере по SSH. В конце покажет ссылку на сайт для проверки.

Если при первом запуске PowerShell откажется выполнять скрипт из соображений безопасности (... cannot be loaded because running scripts is disabled...), выполни один раз:

powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

и подтверди Y.

## Вариант 2

Локально, на ПК (PowerShell, в корне проекта)
powershell
cd "C:\Users\karab\OneDrive\Рабочий стол\coding\rent-app"

# 1. Сборка (генерирует Prisma Client и собирает Next.js)

npm run build

# 2. Копируем внешние пакеты и статику в standalone

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
if (Test-Path "public") { Copy-Item -Recurse -Force "public" "$standalone/public" }

# 3. Убираем мусор dev-режима, который раздувает архив

Remove-Item -Recurse -Force ".next/dev" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".next/cache" -ErrorAction SilentlyContinue

# 4. Упаковка

tar -czf rent-app-build.tar.gz .next

# 5. Заливка на сервер

scp rent-app-build.tar.gz root@\*\*\*:/opt/masterskaya46/
На сервере (SSH)
bash
ssh root@\*\*\*
bash /opt/masterskaya46/deploy.sh

Скрипт сам: распакует во временную папку → проверит, что server.js на месте → подставит правильный .env → атомарно подменит рабочую версию → перезапустит PM2 → проверит, что сайт отвечает → откатится сам, если что-то не так.

Деплой при изменении схемы БД

# 1. Правишь schema.prisma

# 2. Создаёшь миграцию локально (применится на твоей dev-БД в докере)

npx prisma migrate dev --name описание_изменения

# 3. Открываешь туннель к проду (отдельное окно)

ssh -L 5433:localhost:5432 root@\*\*\*

# 4. Применяешь ту же миграцию к проду (другое окно)

$env:DATABASE_URL = "postgresql://rent_app:password@localhost:5433/rent_app"
npx prisma migrate deploy

# 5. Обычный деплой кода

% .\deploy.ps1
