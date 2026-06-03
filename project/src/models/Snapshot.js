const pool = require('../config/database');

class Snapshot {
  // Створити
  static async create(deviceId, imageUrl, reason) {
    try {
      const result = await pool.query(
        'INSERT INTO snapshots (device_id, image_url, trigger_reason) VALUES ($1, $2, $3) RETURNING *',
        [deviceId, imageUrl, reason]
      );
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати для пристрою
  static async getByDeviceId(deviceId, limit = 50) {
    try {
      const result = await pool.query(
        'SELECT * FROM snapshots WHERE device_id = $1 ORDER BY created_at DESC LIMIT $2',
        [deviceId, limit]
      );
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати всі для користувача
  static async getByUserId(userId, limit = 50) {
    try {
      const result = await pool.query(
        `SELECT s.* FROM snapshots s
         JOIN devices d ON s.device_id = d.id
         JOIN rooms r ON d.room_id = r.id
         WHERE r.user_id = $1
         ORDER BY s.created_at DESC
         LIMIT $2`,
        [userId, limit]
      );
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати всі (адмін)
  static async getAll(limit = 100) {
    try {
      const result = await pool.query('SELECT * FROM snapshots ORDER BY created_at DESC LIMIT $1', [limit]);
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Видалити
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM snapshots WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'Snapshot not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = Snapshot;
