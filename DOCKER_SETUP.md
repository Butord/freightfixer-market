
# Налаштування Docker для локального тестування

## Передумови

- Встановлений Docker
- Встановлений Docker Compose

## Кроки для запуску

### 1. Клонування репозиторію

```bash
git clone [URL_ВАШОГО_РЕПОЗИТОРІЮ]
cd [НАЗВА_ПАПКИ_ПРОЕКТУ]
```

### 2. Запуск контейнерів

```bash
docker-compose up -d
```

Це запустить три контейнери:
- Frontend (React) - доступний на http://localhost:8080
- Backend (PHP) - доступний на http://localhost:8000/api
- Database (MySQL) - доступний на localhost:3306

### 3. Перевірка стану контейнерів

```bash
docker-compose ps
```

### 4. Перегляд логів

```bash
# Перегляд всіх логів
docker-compose logs

# Перегляд логів конкретного сервісу
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database
```

### 5. Зупинка контейнерів

```bash
docker-compose down
```

## Налаштування середовища

### Backend

Backend використовує наступні змінні середовища:
- `DB_HOST`: Хост бази даних (за замовчуванням: database)
- `DB_NAME`: Назва бази даних (за замовчуванням: your_database)
- `DB_USER`: Користувач бази даних (за замовчуванням: root)
- `DB_PASS`: Пароль бази даних (за замовчуванням: rootpassword)

### Frontend

Frontend використовує наступні змінні середовища:
- `VITE_API_URL`: URL API (за замовчуванням: http://localhost:8000/api)
- `VITE_ADMIN_SECRET_CODE`: Секретний код адміністратора (за замовчуванням: Butord098#)

## Вирішення проблем

### Проблема з доступом до бази даних

Переконайтеся, що змінні середовища `DB_HOST`, `DB_NAME`, `DB_USER` та `DB_PASS` правильно налаштовані в `docker-compose.yml`.

### Проблема з CORS

Переконайтеся, що заголовки CORS правильно налаштовані в файлі `apache.conf`.

### Перезавантаження серверів

```bash
# Перезавантаження всіх контейнерів
docker-compose restart

# Перезавантаження конкретного сервісу
docker-compose restart frontend
docker-compose restart backend
```
