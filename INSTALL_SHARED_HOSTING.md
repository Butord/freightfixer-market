# Встановлення на шаред хостинг (cPanel / DirectAdmin)

Документ допоможе швидко розгорнути цей проект на звичайному шаред хостингу.

## Вимоги
- PHP 8.0+ (рекомендовано 8.1+)
- MySQL 5.7+/MariaDB 10.3+
- Увімкнений mod_rewrite (SPA маршрути працюють через .htaccess)

## Структура на сервері
- public_html/
  - .htaccess (з кореня проекту)
  - index.html + assets (з папки dist після білду)
  - api/ (вміст із src/api)
    - .htaccess (із src/api/.htaccess)
    - .user.ini (із src/api/.user.ini)
    - інші PHP файли (auth.php, products.php, ...)
- Поза public_html/
  - db_config.php (копія з db_config.sample.php із вашими доступами)

## Кроки встановлення
1) Підготовка локально
- Встановіть залежності та зберіть фронтенд:
  - npm ci
  - npm run build
- За потреби змініть секрет адміна:
  - Фронтенд: .env -> VITE_ADMIN_SECRET_CODE
  - Бекенд: src/api/config.php -> 'admin_secret_code' або ENV ADMIN_SECRET_CODE у панелі хостингу

2) Створіть БД у панелі хостингу
- Створіть базу, користувача та призначте всі привілеї
- Через phpMyAdmin імпортуйте файл: src/api/database.sql (містить схему і демо-дані)

3) Розгортання файлів
- Вміст папки dist/ завантажте у public_html/
- Папку src/api/ цілком завантажте у public_html/api/
- Переконайтесь, що:
  - public_html/.htaccess — присутній (SPA маршрути + CORS)
  - public_html/api/.htaccess — присутній (маршрути API + CORS)
  - public_html/api/.user.ini — присутній (PHP налаштування)

4) Налаштуйте доступи до БД
- Скопіюйте db_config.sample.php у файл поза public_html, наприклад: /home/USER/db_config.php
- Заповніть 'host', 'db', 'user', 'pass'
- Бекенд автоматично знайде цей файл (src/api/db_config.php шукає secrets/db_config.php або /home/USER/db_config.php)
- Права доступу: файл 640/600, директорії 755

5) Перевірка
- Відкрийте https://ваш-домен/
- Перевірте API: https://ваш-домен/api/healthcheck.php — повинно повернути JSON
- Спробуйте реєстрацію/логін

## Встановлення у підкаталог (наприклад, /shop)
- У public_html/shop/ розмістіть вміст dist, а api покладіть у public_html/shop/api
- Відредагуйте .htaccess:
  - public_html/shop/.htaccess: RewriteBase /shop/
  - public_html/shop/api/.htaccess: (зазвичай не потрібно змінювати)
- У vite.config.ts встановіть base: '/shop/' та перевибудуйте (npm run build)

## Налаштування CORS і куків
- На шаред хостингу фронт і бек — на одному домені, тож CORS, як правило, не потрібен
- Якщо API на іншому домені/сабдомені:
  - У .env встановіть VITE_API_URL на повний URL API (https://api.домен/api)
  - У public_html/.htaccess та public_html/api/.htaccess CORS вже налаштований з динамічним Origin та Allow-Credentials

## Типові проблеми та рішення
- 404 при оновленні сторінки: переконайтесь, що public_html/.htaccess присутній
- 500 на API: перевірте лог PHP (error_log), права файлів, версію PHP (8.0+)
- CORS помилки: переконайтесь, що .htaccess у корені та api/ завантажені; не використовується '*' з куками
- Порожні відповіді: перевірте src/services/api/config.ts (обробка не-JSON), URL API

## Безпека
- db_config.php тримайте ПОЗА public_html
- Не завантажуйте node_modules
- Обмежте права доступу до файлів (640/600) і директорій (755)

## Чекліст
- [ ] Білд виконано (dist/)
- [ ] dist/ у public_html/
- [ ] src/api/ у public_html/api/
- [ ] .htaccess у public_html/ і public_html/api/
- [ ] імпортовано src/api/database.sql
- [ ] db_config.php поза public_html заповнений
- [ ] Перевірено /api/healthcheck.php
