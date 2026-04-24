@echo off
REM Script para actualizar carreras en Supabase
REM Ejecutar en terminal con Node.js instalado

set SUPABASE_URL=https://ssyljhtganuaanczxeep.supabase.co
set SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWxqaHRnYW51YWFuY3p4ZWVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjkzMDYwNywiZXhwIjoyMDkyNTA2NjA3fQ.K27H3dHoJyUcbzE8i-SjqWuM6nJ8okhntFM5XHisjqI

echo Actualizando carreras Spartan...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25spartan%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/es.spartan.com\/es\/races\",\"formato\":\"Individual\",\"precio\":\"Desde 99€\"}"

echo.
echo Actualizando carreras Tough Mudder...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25mudder%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/toughmudder.com\/es\",\"formato\":\"Individual\",\"precio\":\"Desde 89€\"}"

echo.
echo Actualizando carreras HYROX...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25hyrox%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/hyrox.com\",\"formato\":\"Individual\",\"precio\":\"Desde 69€\"}"

echo.
echo Actualizando carreras CrossFit...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25crossfit%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/crossfit.com\",\"formato\":\"Individual\"}"

echo.
echo Completado!
pause