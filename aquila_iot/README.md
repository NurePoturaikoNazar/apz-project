# Aquila IoT — Wokwi simulation

Коротко: цей каталог містить прошивку ESP32 для симуляції у Wokwi та інструкції.

How-to (local):

- Скласти прошивку для симуляції з фіксованою MAC (рекомендовано):
```powershell
cd aquila_iot
pio run -e esp32_wokwi_sim
```

- Якщо хочеш використовувати звичайну збірку (реальна MAC):
```powershell
pio run -e esp32doit-devkit-v1
```

- Запустити бекенд (в `project`):
```powershell
cd project
npm install
node server.js
```

- Зареєструвати віртуальний пристрій (якщо потрібно) перед симуляцією:
```powershell
cd project
node scripts/register_sim_device.js --mac AA:BB:CC:DD:EE:01 --name "ESP32 Wokwi"
```

Пояснення мереж: якщо Wokwi симулятор запускається в хмарі і не має доступу до `localhost:3000`, запусти `ngrok http 3000` і постав `SERVER_URL` у `aquila_iot/src/main.cpp` на адресу `https://xxxx.ngrok.io`.
