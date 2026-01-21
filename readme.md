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

10. git branch for clean code
main (production-ready)
└── develop (integration branch)
    ├── feature/database-setup
    ├── feature/backend-api
    ├── feature/websocket-realtime
    ├── feature/frontend-ui
    ├── feature/drag-drop
    └── feature/testing-docs
# Day 1
git checkout -b feature/database-setup
# ... work on Prisma schema + seed data
git commit -m "Complete database models and seed 40 tracks"
git push

git checkout -b feature/backend-api
# ... work on Express routes
git commit -m "Implement REST API endpoints"
git push

# Day 2
git checkout -b feature/websocket-realtime
# ... work on WebSocket
git commit -m "Add WebSocket for realtime sync"
git push

git checkout -b feature/frontend-ui
# ... work on React components
git commit -m "Build playlist and library UI components"
git push

# Day 3
git checkout -b feature/drag-drop
# ... work on drag & drop
git commit -m "Implement drag-drop with position algorithm"
git push

git checkout -b feature/testing-docs
# ... write tests and README
git commit -m "Add tests and comprehensive documentation"
git push

# Final merge to main
git checkout main
git merge develop
git push

11. seeding data
/prisma/seed.ts
# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate dev --name init

# Seed the database
npx prisma db seed

12. intialise crud playlist rest api endpoints
git workflow:
# Commit backend API
git add .
git commit -m "feat: implement REST API endpoints for playlist CRUD operations"
git push -u origin feature/backend-api

# Switch to develop and merge
git checkout develop
git merge feature/backend-api
git push

# Create new branch for WebSocket
git checkout -b feature/websocket-realtime


13. initialise websocket
14. start working on frontend
npm install zustand

