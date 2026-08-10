This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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

scp rent-app-build.tar.gz root@194.87.94.197:/opt/masterskaya46/
На сервере (SSH)
bash
ssh root@194.87.94.197
bash /opt/masterskaya46/deploy.sh

Скрипт сам: распакует во временную папку → проверит, что server.js на месте → подставит правильный .env → атомарно подменит рабочую версию → перезапустит PM2 → проверит, что сайт отвечает → откатится сам, если что-то не так.
