# Облачное хранилище My Cloud

Развернутое на сервере REG.RU [приложение](http://95.163.228.81:5000).

## Запуск приложения на локальном диске

1. Создаём директорию для проекта
2. Клонируем в неё репозиторий:
   ```
   git clone https://github.com/JulieSoboleva/mycloud-diploma.git
   ```
3. Открываем папку `mycloud-diploma` в любой IDE и запускаем встроенный терминал

4. Переходим в папку `backend`:
   ```
   cd backend
   ```
5. Создаём виртуальное окружение:
   ```
   python -m venv env
   ```
6. Активируем его:
   ```
   env/Scripts/activate
   ```
7. Устанавливаем зависимости:
   ```
   pip install -r requirements.txt
   ```
8. В папке `backend` создаём файл `.env` в соответствии с шаблоном:
      ```
      SECRET_KEY=
      DEBUG=
      ALLOWED_HOSTS=(list)

      DB_HOST=localhost
      DB_PORT=5432
      DB_NAME=db_cloud
      DB_USER=user
      DB_PASSWORD=password

      ADMIN_USERNAME=
      ADMIN_FIRSTNAME=
      ADMIN_LASTNAME=
      ADMIN_EMAIL=
      ADMIN_PASSWORD=

      BASE_STORAGE=
      ```
9. Создаём базу данных с учётом настроек указанных в файле `.env`:
   `createdb -U <DB_USER> <DB_NAME>` Пароль: `<DB_PASSWORD>`
10. Применяем миграции:
   ```
   python manage.py migrate
   ```
11. Создаём суперпользователя с указанными в файле `.env` данными:
   ```
   python manage.py create_superuser
   ```
12. Запускаем сервер:
   ```
   python manage.py runserver
   ```
13. Открываем второй терминал в директории `frontend`
14. В файле `.env` указываем базовый URL сервера:
   ```
   VITE_SERVER_URL=http://localhost:8000/api
   ```
15. Устанавливаем необходимые зависимости:
   ```
   npm install
   ```
16. Запускаем приложение:
   ```
   npm run dev
   ```

## Развёртывание приложения на облачном сервере

1. Генерируем SSH-ключ, если его ещё нет
2. Копируем публичный SSH-ключ
3. Создаем на сайте [reg.ru](https://cloud.reg.ru) облачный сервер:
   - образ - `Ubuntu 22.04 LTS`
   - vCPU и тип диска - `Стандартный`
   - тариф - `Std C1-M1-D10`
   - регион размещения - `Москва`
   
   Добавляем наш публичный SSH-ключ, задав ему название.

   Указываем название сервера.

   Нажимаем кнопку `Заказать сервер`

   Получаем по электронной почте данные для подключения к серверу через SSH.
4. Запускаем терминал и подключаемся к серверу, использую полученные данные:
   ```
   ssh root@<ip адрес сервера>
   ```
   Вводим пароль
5. Создаем нового пользователя:
   ```
   adduser <имя пользователя>
   ```
6. Добавляем созданного пользователя в группу `sudo`:
   ```
   usermod <имя пользователя> -aG sudo
   ```
7. Выходим из-под пользователя `root`:
   ```
   logout
   ```
8. Подключаемся к серверу под новым пользователем:
   ```
   ssh <имя пользователя>@<ip адрес сервера>
   ```
9. Скачиваем обновления пакетов `apt`:
   ```
   sudo apt update
   ```
10. Устанавливаем необходимые пакеты:
   ```
   sudo apt install python3-venv python3-pip postgresql nginx
   ```
11. Заходим в терминал `psql` под пользователем `postgres`:
   ```
   sudo -u postgres psql
   ```
12. Создаём базу данных:
   ```
   create database db_cloud;
   ```
13. Задаём пароль для пользователя `postgres`:
   ```
   alter user postgres with password 'postgres';
   ```
14. Выходим из терминала `psql`:
   ```
   \q
   ```
15. Проверяем, что установлен `git`:
   ```
   git --version
   ```
16. Клонируем репозиторий с проектом:
   ```
   git clone https://github.com/JulieSoboleva/mycloud-diploma.git
   ```
17. Переходим в папку `backend`:
   ```
   cd /home/<имя пользователя>/mycloud-diploma/backend
   ```
18. Устанавливаем виртуальное окружение:
   ```
   python3 -m venv env
   ```
19. Активируем его:
   ```
   source env/bin/activate
   ```
20. Устанавливаем необходимые зависимости:
   ```
   pip install -r requirements.txt
   ```
21. В папке `backend` создаём файл `.env` 
   ```
   nano .env
   ```

   в соответствии с шаблоном:
      ```
      SECRET_KEY=
      DEBUG=
      ALLOWED_HOSTS=(list)

      DB_HOST=localhost
      DB_PORT=5432
      DB_NAME=db_cloud
      DB_USER=user
      DB_PASSWORD=password

      ADMIN_USERNAME=
      ADMIN_FIRSTNAME=
      ADMIN_LASTNAME=
      ADMIN_EMAIL=
      ADMIN_PASSWORD=

      BASE_STORAGE=
      ```
22. Применяем миграции:
   ```
   python manage.py migrate
   ```
23. Создаём суперпользователя:
   ```
   python manage.py create_superuser
   ```
24. Собираем весь статичный контент в одну папку на сервере:
   ```
   python manage.py collectstatic
   ```
25. Запускаем сервер:
   ```
   python manage.py runserver 0.0.0.0:8000
   ```
26. Проверяем работу `gunicorn`:
   ```
   gunicorn backend.wsgi -b 0.0.0.0:8000
   ```
27. Создаём сокет `gunicorn.socket`:
   ```
   sudo nano /etc/systemd/system/gunicorn.socket
   ```
   со следующим содержимым

      ```
      [Unit]
      Description=gunicorn socket

      [Socket]
      ListenStream=/run/gunicorn.sock

      [Install]
      WantedBy=sockets.target
      ```
28. Создаём сервис `gunicorn.service`:
   ```
   sudo nano /etc/systemd/system/gunicorn.service
   ```
   с содержимым

      ```
      [Unit]
      Description=gunicorn daemon
      Requires=gunicorn.socket
      After=network.target

      [Service]
      User=<имя пользователя>
      Group=www-data
      WorkingDirectory=/home/<имя пользователя>/mycloud-diploma/backend
      ExecStart=/home/<имя пользователя>/mycloud-diploma/backend/env/bin/gunicorn \
               --access-logfile - \
               --workers=3 \
               --bind unix:/run/gunicorn.sock \
               backend.wsgi:application

      [Install]
      WantedBy=multi-user.target
      ```
29. Запускаем сокет `gunicorn.socket`:
   ```
   sudo systemctl start gunicorn.socket
   ```
   ```
   sudo systemctl enable gunicorn.socket
   ```
30. Проверяем его статус:
   ```
   sudo systemctl status gunicorn.socket
   ```
31. Убеждаемся, что файл `gunicorn.sock` присутствует в папке `/run`:
   ```
   file /run/gunicorn.sock
   ```
32. Проверяем статус `gunicorn`:
   ```
   sudo systemctl status gunicorn
   ```
33. Создаём модуль `nginx`:
   ```
   sudo nano /etc/nginx/sites-available/backend
   ```
   со следующим содержимым

      ```
      server {
         listen 80;
         server_name <ip адрес сервера>;

         location = /favicon.ico {
            access_log off;
            log_not_found off;
         }

         location /static/ {
            root /home/<имя пользователя>/mycloud-diploma/backend;
         }

         location / {
            include proxy_params;
            proxy_pass http://unix:/run/gunicorn.sock;
         }
      }
      ```
34. Создаём символическую ссылку:
   ```
   sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled
   ```
35. Добавляем пользователя `www-data` в группу текущего пользователя:
   ```
   sudo usermod -aG <имя пользователя> www-data
   ```
36. Диагностируем `nginx` на предмет ошибок в синтаксисе:
   ```
   sudo nginx -t
   ```
37. Перезапускаем веб-сервер:
   ```
   sudo systemctl restart nginx
   ```
38. Проверяем статус `nginx`:
   ```
   sudo systemctl status nginx
   ```
39. При помощи `firewall` даём полные права `nginx` для подключений:
   ```
   sudo ufw allow 'Nginx Full'
   ```
40. Устанавливаем [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm):
   ```
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```
41. Добавляем переменную окружения:
   ```
   export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
   ```
42. Проверяем версию `nvm`:
   ```
   nvm -v
   ```
43. Устанавливаем нужную версию `node`:
   ```
   nvm install <номер версии>
   ```
44. Переходим в папку проекта `frontend`:
   ```
   cd /home/<имя пользователя>/mycloud-diploma/frontend
   ```
45. Создаём файл `.env`
   ```
   nano .env
   ```

    и указываем в нём базовый URL:
   ```
   VITE_SERVER_URL=http://<ip адрес сервера>/api
   ```
46. Устанавливаем необходимые зависимости:
   ```
   npm i
   ```
47. Создаём файл `start.sh`:
   ```
   nano start.sh
   ```
   со следующим содержимым

      ```
      #!/bin/bash
      . /home/<имя пользователя>/.nvm/nvm.sh
      npm run dev
      ```
48. Делаем файл `start.sh` исполняемым:
   ```
   chmod +x /home/<имя пользователя>/mycloud-diploma/frontend/start.sh
   ```
49. Создаём сервис `frontend.service`:
   ```
   sudo nano /etc/systemd/system/frontend.service
   ```
   с содержимым:

      ```
      [Unit]
      Description=frontend service
      After=network.target

      [Service]
      User=<имя пользователя>
      Group=www-data
      WorkingDirectory=/home/<имя пользователя>/mycloud-diploma/frontend
      ExecStart=/home/<имя пользователя>/mycloud-diploma/frontend/start.sh

      [Install]
      WantedBy=multi-user.target
      ```
50. Запускаем сервис `frontend`:
   ```
   sudo systemctl start frontend
   ```
   ```
   sudo systemctl enable frontend
   ```
51. Проверяем его статус:
   ```
   sudo systemctl status frontend
   ```
52. Проверяем доступ к сайту:
   ```
   http://<ip адрес сервера>:5000
   ```
53. Проверяем доступ к административной панели:
   ```
   http://<ip адрес сервера>/admin/
   ```