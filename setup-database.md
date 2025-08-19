# Database Setup Guide

## Quick Setup with Docker (Recommended)

1. **Start PostgreSQL with Docker Compose:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Install dependencies and generate Prisma client:**
   ```bash
   cd packages/backend
   npm install
   npx prisma generate
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Seed the database with initial data:**
   ```bash
   npm run db:seed
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

## Alternative: Local PostgreSQL Installation

If you prefer to install PostgreSQL locally:

1. **Install PostgreSQL:**
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/

2. **Create database and user:**
   ```sql
   CREATE DATABASE teachme_db;
   CREATE USER teachme_user WITH PASSWORD 'teachme_password';
   GRANT ALL PRIVILEGES ON DATABASE teachme_db TO teachme_user;
   ```

3. **Update the DATABASE_URL in packages/backend/.env if needed**

4. **Follow steps 2-5 from the Docker setup above**

## Verification

1. **Check database connection:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Create a demo user:**
   ```bash
   curl -X POST http://localhost:3001/api/demo/create-user
   ```

3. **Seed achievements and badges:**
   ```bash
   curl -X POST http://localhost:3001/api/demo/seed-database
   ```

## Troubleshooting

- **Port 5432 already in use:** Stop any existing PostgreSQL services or change the port in docker-compose.yml
- **Permission denied:** Make sure Docker is running and you have proper permissions
- **Connection refused:** Wait a few seconds for PostgreSQL to fully start up

## Database Management

- **View database in browser:** `npx prisma studio`
- **Reset database:** `npx prisma migrate reset`
- **Generate new migration:** `npx prisma migrate dev --name your_migration_name`

The profile page should now load properly once the database is set up and seeded!
