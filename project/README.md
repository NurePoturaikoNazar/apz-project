# Aquila — локальний запуск

Короткі інструкції для локального налаштування (Windows) та через DBeaver.

1) Перевір `.env`
- Файл: `project/.env` (вже оновлено): `DB_USER=postgres`, `DB_PASSWORD=12345678`, `DB_NAME=aquila_db`, `DB_HOST=localhost`, `DB_PORT=5432`.

2) Створити базу та застосувати схему (через DBeaver)
- Відкрий DBeaver → `Database` → `New Connection` → вибери `PostgreSQL`.
- Підключення: Host = `localhost`, Port = `5432`, Database = `postgres`, User = `postgres`, Password = `12345678`.
- Після підключення: правий клік по з'єднанню → `SQL Editor` → `New SQL Script` → виконай:
  ```sql
  CREATE DATABASE aquila_db;
  ```
- Потім правий клік по базі `aquila_db` → `SQL Editor` → `Open SQL Script` і вибери файл `project/init_db.sql` або встав його вікно і виконай (Execute).

3) Альтернативно: автоматично через Node (скрипт `scripts/init_db.js`)
- Після `npm install` запусти:
  ```powershell
  node scripts/init_db.js
  ```
  Скрипт створить базу `aquila_db` (якщо ще не існує) і застосує `init_db.sql`.

4) Встановлення залежностей та запуск сервера
```powershell
cd "c:\Users\kutst\OneDrive\Desktop\uni_ 6_semestr\АПЗ\apz-project\project"
npm install
npm start
```

5) Перевірка
- Відкрий у браузері: `http://localhost:3000/` або виконай:
  ```powershell
  curl http://localhost:3000/
  ```

6) Що робити, якщо щось пішло не так
- Переконайся, що служба PostgreSQL запущена і дані в `project/.env` відповідають реальним.
- Якщо будуть помилки при застосуванні схеми, скопіюй помилку сюди — допоможу розібратися.

---

## Docker Compose та навантажувальне тестування

Для швидкого запуску з горизонтальним масштабуванням додано:
- `Dockerfile`
- `docker-compose.yml`
- `nginx.conf`
- `locustfile.py`
- `requirements-locust.txt`

### Запуск Docker Compose

У папці `project` виконай:
```powershell
cd "c:\Users\kutst\OneDrive\Desktop\uni_ 6_semestr\APZ\apz-project\project"
docker compose up --scale backend=1 -d
```

Це підніме:
- PostgreSQL на `localhost:5432`
- один контейнер backend
- Nginx на `http://localhost`

### Масштабування

Щоб порівняти 1 та 3 копії бекенду:
```powershell
docker compose up --scale backend=3 -d
```

### Тестування Locust

Створи та активуй віртуальне середовище (один раз):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Встанови Locust у це середовище:
```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements-locust.txt
```

Запусти тест:
```powershell
python -m locust -f locustfile.py --host http://localhost
```

Потім відкрий у браузері:
- `http://localhost:8089`

Запусти 50 користувачів і розпочни тест.

### Що дивитися у Locust

- `Requests/s` (RPS)
- `Average response time`
- `Failures`

Порівняй значення для:
- `backend=1`
- `backend=3`

Якщо при 3 копіях RPS вищий і помилок менше — це підтверджує користь горизонтального масштабування.

---
Файли, додані/оновлені: `project/.env` (оновлено), `project/scripts/init_db.js` (додається), `project/README.md` (цей файл), `project/Dockerfile`, `project/docker-compose.yml`, `project/nginx.conf`, `project/locustfile.py`, `project/requirements-locust.txt`.
