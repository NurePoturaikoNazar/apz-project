const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { apiReference } = require('@scalar/express-api-reference');

// Импортуємо routes
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const deviceRoutes = require('./routes/devices');
const telemetryRoutes = require('./routes/telemetry');
const snapshotRoutes = require('./routes/snapshots');
const alertRoutes = require('./routes/alerts');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- SCALAR API DOCUMENTATION ---
app.use('/api/reference', apiReference({
  theme: 'kepler',
  spec: { url: '/openapi.json' },
}));

// OpenAPI/Swagger JSON - ДЕТАЛЬНА ДОКУМЕНТАЦІЯ З ПРИКЛАДАМИ
app.get('/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: '🚀 Aquila System API',
      version: '2.0.0',
      description: 'Повнофункціональна система моніторингу IoT кімнат. Інтеграція ESP32 датчиків, дебаунс алертів (15 хв), ACID транзакції, валідація.',
      contact: { name: 'Aquila Support' },
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development Server' }],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            email: { type: 'string', example: 'user@example.com' },
            full_name: { type: 'string', example: 'John Doe' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Device: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            room_id: { type: 'string' },
            name: { type: 'string' },
            mac_address: { type: 'string' },
            type: { type: 'string' },
            is_active: { type: 'boolean' },
          },
        },
        Alert: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            device_id: { type: 'string' },
            type: { type: 'string' },
            message: { type: 'string' },
            is_read: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    paths: {
      '/api/users': {
        get: {
          summary: '📋 Отримати всіх користувачів',
          tags: ['Users'],
          responses: {
            200: {
              description: 'Список користувачів',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                  example: [
                    { id: '550e8400-e29b-41d4-a716-446655440000', email: 'john@example.com', full_name: 'John Doe', created_at: '2025-12-16T10:30:00Z' },
                    { id: '660f9500-e39c-42e5-b827-557766551111', email: 'jane@example.com', full_name: 'Jane Smith', created_at: '2025-12-16T11:00:00Z' },
                  ],
                },
              },
            },
          },
        },
      },
      '/api/users/register': {
        post: {
          summary: '✍️ Зареєструвати нового користувача',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                    full_name: { type: 'string' },
                  },
                  required: ['email', 'password', 'full_name'],
                },
                example: { email: 'newuser@example.com', password: 'SecurePass123!', full_name: 'New User' },
              },
            },
          },
          responses: {
            201: { description: 'Користувач успішно зареєстрований' },
            400: { description: 'Email вже використовується або невірні дані' },
          },
        },
      },
      '/api/users/login': {
        post: {
          summary: '🔐 Вхід користувача',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] },
                example: { email: 'user@example.com', password: 'SecurePass123!' },
              },
            },
          },
          responses: { 200: { description: 'Успішний вхід' }, 401: { description: 'Невірний email або пароль' } },
        },
      },
      '/api/users/{id}': {
        get: {
          summary: '👤 Отримати користувача по ID',
          tags: ['Users'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'UUID користувача' }],
          responses: { 200: { description: 'Користувач' } },
        },
        put: {
          summary: '✏️ Оновити профіль користувача',
          tags: ['Users'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object', properties: { email: { type: 'string' }, full_name: { type: 'string' } } },
                example: { email: 'newemail@example.com', full_name: 'Updated Name' },
              },
            },
          },
          responses: { 200: { description: 'Профіль оновлено' } },
        },
        delete: {
          summary: '🗑️ Видалити користувача',
          tags: ['Users'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Користувача видалено' } },
        },
      },
      '/api/users/{id}/password': {
        patch: {
          summary: '🔑 Змінити пароль користувача',
          tags: ['Users'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object', properties: { newPassword: { type: 'string' } }, required: ['newPassword'] },
                example: { newPassword: 'NewSecurePass456!' },
              },
            },
          },
          responses: { 200: { description: 'Пароль змінено' } },
        },
      },
      '/api/rooms': {
        get: {
          summary: '🏠 Отримати всі кімнати з пристроями',
          tags: ['Rooms'],
          responses: {
            200: {
              description: 'Список кімнат',
              content: {
                'application/json': {
                  example: [
                    { id: '550e8400-e29b', user_id: '660f9500', name: 'Гостина', type: 'living_room', devices: [] },
                  ],
                },
              },
            },
          },
        },
        post: {
          summary: '➕ Створити нову кімнату',
          tags: ['Rooms'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    description: { type: 'string' },
                  },
                  required: ['userId', 'name'],
                },
                example: {
                  userId: '550e8400-e29b-41d4-a716-446655440000',
                  name: 'Гостина',
                  type: 'living_room',
                  description: 'Основна кімната з датчиками',
                },
              },
            },
          },
          responses: { 201: { description: 'Кімната створена' } },
        },
      },
      '/api/rooms/{id}': {
        get: {
          summary: '🏠 Отримати кімнату з пристроями',
          tags: ['Rooms'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Кімната із вложеними пристроями' } },
        },
        put: {
          summary: '✏️ Оновити кімнату',
          tags: ['Rooms'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object', properties: { name: { type: 'string' }, type: { type: 'string' }, description: { type: 'string' } } },
                example: { name: 'Спальня', type: 'bedroom', description: 'Оновлена кімната' },
              },
            },
          },
          responses: { 200: { description: 'Кімнату оновлено' } },
        },
        delete: {
          summary: '🗑️ Видалити кімнату (ACID)',
          tags: ['Rooms'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Видаляє кімнату + ВСІ пристрої + вимірювання + снімки + алерти' }],
          responses: { 200: { description: 'Кімнату та всі залежні дані видалено гарантовано (BEGIN/COMMIT/ROLLBACK)' } },
        },
      },
      '/api/devices': {
        get: {
          summary: '🔌 Отримати всі пристрої',
          tags: ['Devices'],
          responses: { 200: { description: 'Список пристроїв' } },
        },
        post: {
          summary: '➕ Зареєструвати новий пристрій',
          tags: ['Devices'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    roomId: { type: 'string' },
                    name: { type: 'string' },
                    macAddress: { type: 'string' },
                    type: { type: 'string' },
                  },
                  required: ['roomId', 'name', 'macAddress', 'type'],
                },
                example: { roomId: '550e8400-e29b', name: 'Датчик температури', macAddress: 'AA:BB:CC:DD:EE:01', type: 'temperature_sensor' },
              },
            },
          },
          responses: { 201: { description: 'Пристрій зареєстрований' } },
        },
      },
      '/api/devices/{id}': {
        get: {
          summary: '🔌 Отримати пристрій по ID',
          tags: ['Devices'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Пристрій' } },
        },
        put: {
          summary: '✏️ Оновити пристрій',
          tags: ['Devices'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object', properties: { name: { type: 'string' }, macAddress: { type: 'string' }, type: { type: 'string' }, is_active: { type: 'boolean' } } },
                example: { name: 'Датчик 2', macAddress: 'AA:BB:CC:DD:EE:FF', is_active: true },
              },
            },
          },
          responses: { 200: { description: 'Пристрій оновлено' } },
        },
        delete: {
          summary: '🗑️ Видалити пристрій',
          tags: ['Devices'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Пристрій видалено' } },
        },
      },
      '/api/telemetry': {
        post: {
          summary: '📡 Відправити дані сенсорів (ESP32 → Server)',
          tags: ['Telemetry'],
          description: '⚡ Валідація: MAC regex + типи + дебаунс алертів на 15 хв',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    macAddress: { type: 'string', description: 'MAC у форматі AA:BB:CC:DD:EE:FF' },
                    temperature: { type: 'number', description: '-50 до 150°C' },
                    humidity: { type: 'number', description: '0 до 100%' },
                    lightLevel: { type: 'integer', description: '0 до 10000 lux' },
                    soundLevel: { type: 'integer', description: '0 до 150 dB' },
                  },
                  required: ['macAddress', 'temperature', 'humidity', 'lightLevel', 'soundLevel'],
                },
                examples: {
                  normal: {
                    summary: 'Норма в усіх датчиків',
                    value: { macAddress: 'AA:BB:CC:DD:EE:01', temperature: 22.5, humidity: 55, lightLevel: 500, soundLevel: 45 },
                  },
                  alert_temp_high: {
                    summary: 'Тревога: Температура 35°C (>28°C макс)',
                    value: { macAddress: 'AA:BB:CC:DD:EE:01', temperature: 35, humidity: 55, lightLevel: 500, soundLevel: 45 },
                    description: 'Створить алерт TEMPERATURE_HIGH (але тільки 1 раз на 15 хв)',
                  },
                  alert_humidity_low: {
                    summary: 'Тревога: Вологість 20% (<30% мін)',
                    value: { macAddress: 'AA:BB:CC:DD:EE:01', temperature: 22, humidity: 20, lightLevel: 500, soundLevel: 45 },
                  },
                  alert_sound_high: {
                    summary: 'Тревога: Шум 90 dB (>80 макс)',
                    value: { macAddress: 'AA:BB:CC:DD:EE:01', temperature: 22, humidity: 55, lightLevel: 500, soundLevel: 90 },
                  },
                  invalid_mac: {
                    summary: 'Помилка: Невірний MAC формат',
                    value: { macAddress: 'INVALID', temperature: 22.5, humidity: 55, lightLevel: 500, soundLevel: 45 },
                    description: 'Помилка 400: Invalid MAC address format',
                  },
                  invalid_type: {
                    summary: 'Помилка: Температура - не число',
                    value: { macAddress: 'AA:BB:CC:DD:EE:01', temperature: 'not_a_number', humidity: 55, lightLevel: 500, soundLevel: 45 },
                    description: 'Помилка 400: Temperature must be a number',
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Дані прийняті, вимірювання записане, можливо створено алерт (якщо дебаунс не заблокував)' },
            400: { description: 'Валідація не пройшла: невірний MAC, неправильний тип, значення поза діапазоном' },
            404: { description: 'Пристрій з таким MAC не знайдений' },
          },
        },
      },
      '/api/telemetry/{deviceId}': {
        get: {
          summary: '📊 Отримати історію вимірювань пристрою',
          tags: ['Telemetry'],
          parameters: [
            { name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 }, description: 'Кількість записів (макс 100)' },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 }, description: 'Пропустити записів' },
          ],
          responses: { 200: { description: 'Список вимірювань' } },
        },
      },
      '/api/alerts': {
        get: {
          summary: '🚨 Отримати всі алерти',
          tags: ['Alerts'],
          responses: { 200: { description: 'Список алертів (макс 100 найсвіжіших)' } },
        },
        post: {
          summary: '➕ Створити алерт вручну',
          tags: ['Alerts'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    deviceId: { type: 'string' },
                    type: { type: 'string' },
                    message: { type: 'string' },
                  },
                  required: ['deviceId', 'type', 'message'],
                },
                example: { deviceId: '550e8400', type: 'MANUAL', message: 'Ручно створений алерт' },
              },
            },
          },
          responses: { 201: { description: 'Алерт створений' } },
        },
      },
      '/api/alerts/unread': {
        get: {
          summary: '📬 Отримати непрочитані алерти',
          tags: ['Alerts'],
          responses: { 200: { description: 'Список непрочитаних алертів' } },
        },
      },
      '/api/alerts/unread/count': {
        get: {
          summary: '🔔 Отримати кількість непрочитаних алертів',
          tags: ['Alerts'],
          responses: { 200: { description: 'Об\'єкт {count: число}' } },
        },
      },
      '/api/alerts/{id}/read': {
        put: {
          summary: '✅ Позначити алерт як прочитаний',
          tags: ['Alerts'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Алерт позначено' } },
        },
      },
      '/api/alerts/{id}/unread': {
        put: {
          summary: '↩️ Позначити алерт як непрочитаний',
          tags: ['Alerts'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Алерт позначено' } },
        },
      },
      '/api/alerts/{id}': {
        delete: {
          summary: '🗑️ Видалити алерт',
          tags: ['Alerts'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Алерт видалено' } },
        },
      },
      '/api/snapshots': {
        post: {
          summary: '📸 Створити снімок від камери',
          tags: ['Snapshots'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    macAddress: { type: 'string' },
                    imageUrl: { type: 'string' },
                    reason: { type: 'string' },
                  },
                  required: ['macAddress', 'imageUrl'],
                },
                example: { macAddress: 'AA:BB:CC:DD:EE:02', imageUrl: 'https://example.com/snapshot.jpg', reason: 'motion_detected' },
              },
            },
          },
          responses: { 201: { description: 'Снімок збережено' } },
        },
      },
      '/api/snapshots/{deviceId}': {
        get: {
          summary: '📸 Отримати снімки пристрою',
          tags: ['Snapshots'],
          parameters: [
            { name: 'deviceId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          ],
          responses: { 200: { description: 'Список снімків' } },
        },
      },
      '/api/snapshots/{id}': {
        delete: {
          summary: '🗑️ Видалити снімок',
          tags: ['Snapshots'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Снімок видалено' } },
        },
      },
    },
  });
});

// --- ROOT ---
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '🚀 Aquila System API is running',
    version: '2.0.0',
    docs: 'http://localhost:3000/api/reference',
  });
});

// --- API ROUTES ---
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/snapshots', snapshotRoutes);
app.use('/api/alerts', alertRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
