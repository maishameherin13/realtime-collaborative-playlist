1. initialize npm for frontend
npm iniy -y 

2. setup nextjs
npx create-next-app@latest client --typescript --tailwind --app
//custom
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes

3. initialise npm for backend
npm init -y
//setup express
npm install express prisma @prisma/client ws cors dotenv
npm install -D typescript @types/node @types/express nodemon ts-node

5. initialise prisma w sqlite
npx prisma init --datasource-provider sqlite

6. Install Prisma 5 (stable version)
npm install prisma@5.22.0 @prisma/client@5.22.0

7. update scripts
"scripts": {
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:seed": "ts-node prisma/seed.ts"
}
8. update prisma/schema.prisma with database schema

9. initialise github
# Initialize git
git init
# Create .gitignore file
# initial commit
git add .
git commit -m "Initial project setup: Next.js frontend + Express backend"
# connect to 
git remote add origin https://github.com/maishameherin13/realtime-collaborative-playlist.git
git branch -M main
git push -u origin main

