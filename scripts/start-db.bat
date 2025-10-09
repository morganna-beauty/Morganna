@echo off
REM Start database only for local development

echo 🗄️  Starting PostgreSQL database in Docker...
docker-compose -f docker-compose.db-only.yml up -d

echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak >nul

echo ✅ Database is ready!
echo 📊 Database URL: postgresql://postgres:postgres@localhost:5432/morganna_db
echo 🔍 To stop the database: npm run db:stop