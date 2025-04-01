
#!/bin/bash

# Простий скрипт для перевірки доступності API сервера

echo "Перевірка API сервера..."
echo "API URL: ${VITE_API_URL:-http://localhost:8000/api}"

# Перевірка підключення HTTP
curl -I "${VITE_API_URL:-http://localhost:8000/api}/auth.php?action=register" 2>/dev/null | head -n 1

# Якщо curl не працює, спробувати wget
if [ $? -ne 0 ]; then
  echo "curl не працює, спробуємо wget..."
  wget -q --spider "${VITE_API_URL:-http://localhost:8000/api}/auth.php?action=register"
  if [ $? -eq 0 ]; then
    echo "API доступний через wget!"
  else
    echo "API недоступний. Переконайтеся, що сервер запущено."
  fi
fi

# Перевірити конфігурацію Docker
echo -e "\nПеревірка контейнерів Docker:"
docker ps | grep -E 'frontend|backend|database'

# Перевірити логи контейнерів
echo -e "\nПеревірка логів backend контейнера (останні 10 рядків):"
docker-compose logs --tail=10 backend

echo -e "\nДодаткові кроки для налагодження:"
echo "1. Виконайте 'docker-compose down' і потім 'docker-compose up -d'"
echo "2. Перевірте чи порт 8000 не блокується брандмауером"
echo "3. Переконайтеся, що змінна VITE_API_URL встановлена правильно в .env файлі"
echo "4. Спробуйте відкрити ${VITE_API_URL:-http://localhost:8000/api} у вашому браузері"
