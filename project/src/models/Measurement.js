const pool = require('../config/database');

class Measurement {
  // Створити
  static async create(deviceId, temperature, humidity, lightLevel, soundLevel) {
    try {
      const result = await pool.query(
        'INSERT INTO measurements (device_id, temperature, humidity, light_level, sound_level) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [deviceId, temperature, humidity, lightLevel, soundLevel]
      );
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати історію для пристрою
  static async getByDeviceId(deviceId, limit = 100, offset = 0) {
    try {
      const result = await pool.query(
        'SELECT * FROM measurements WHERE device_id = $1 ORDER BY recorded_at DESC LIMIT $2 OFFSET $3',
        [deviceId, limit, offset]
      );
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати останні вимірювання для кімнати
  static async getLatestByRoom(roomId) {
    try {
      const result = await pool.query(`
        SELECT d.id, d.name, d.mac_address, m.* 
        FROM devices d
        LEFT JOIN measurements m ON d.id = m.device_id
        WHERE d.room_id = $1 AND m.id IN (
          SELECT id FROM measurements WHERE device_id = d.id ORDER BY recorded_at DESC LIMIT 1
        )
        ORDER BY d.created_at`,
        [roomId]
      );
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати історію вимірювань для кімнати
  static async getHistoryByRoom(roomId, limit = 100) {
    try {
      const result = await pool.query(`
        SELECT m.* 
        FROM measurements m
        JOIN devices d ON d.id = m.device_id
        WHERE d.room_id = $1
        ORDER BY m.recorded_at DESC
        LIMIT $2
      `, [roomId, limit]);
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = Measurement;
