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
Файли, додані/оновлені: `project/.env` (оновлено), `project/scripts/init_db.js` (додається), `project/README.md` (цей файл).
