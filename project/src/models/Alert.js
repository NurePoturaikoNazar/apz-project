const pool = require('../config/database');

class Alert {
  // Перевірити, чи вже є недавній алерт того ж типу (за останні 15 хвилин)
  static async checkRecentAlert(deviceId, type, debounceMinutes = 15) {
    try {
      const result = await pool.query(
        `SELECT id FROM alerts 
         WHERE device_id = $1 AND type = $2 
         AND created_at > NOW() - INTERVAL '${debounceMinutes} minutes'
         LIMIT 1`,
        [deviceId, type]
      );
      return result.rows.length > 0; // true = алерт існує, false = новий
    } catch (err) {
      console.error('Error checking recent alert:', err);
      return false;
    }
  }

  // Створити
  static async create(deviceId, type, message) {
    try {
      const result = await pool.query(
        'INSERT INTO alerts (device_id, type, message) VALUES ($1, $2, $3) RETURNING *',
        [deviceId, type, message]
      );
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати всі
  static async getAll(limit = 100, userId = null) {
    try {
      if (userId) {
        const result = await pool.query(
          `SELECT a.* FROM alerts a
           JOIN devices d ON a.device_id = d.id
           JOIN rooms r ON d.room_id = r.id
           WHERE r.user_id = $1
           ORDER BY a.created_at DESC
           LIMIT $2`,
          [userId, limit]
        );
        return { success: true, data: result.rows };
      }

      const result = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT $1', [limit]);
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати непрочитані
  static async getUnread(userId = null) {
    try {
      if (userId) {
        const result = await pool.query(
          `SELECT a.* FROM alerts a
           JOIN devices d ON a.device_id = d.id
           JOIN rooms r ON d.room_id = r.id
           WHERE r.user_id = $1 AND a.is_read = false
           ORDER BY a.created_at DESC`,
          [userId]
        );
        return { success: true, data: result.rows };
      }
      const result = await pool.query('SELECT * FROM alerts WHERE is_read = false ORDER BY created_at DESC');
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати для пристрою
  static async getByDeviceId(deviceId, limit = 50) {
    try {
      const result = await pool.query(
        'SELECT * FROM alerts WHERE device_id = $1 ORDER BY created_at DESC LIMIT $2',
        [deviceId, limit]
      );
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static async getByUserId(userId, limit = 100) {
    try {
      const result = await pool.query(
        `SELECT a.* FROM alerts a
         JOIN devices d ON a.device_id = d.id
         JOIN rooms r ON d.room_id = r.id
         WHERE r.user_id = $1
         ORDER BY a.created_at DESC
         LIMIT $2`,
        [userId, limit]
      );
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Позначити як прочитане
  static async markAsRead(id) {
    try {
      const result = await pool.query(
        'UPDATE alerts SET is_read = true WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return { success: false, error: 'Alert not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Позначити як непрочитане
  static async markAsUnread(id) {
    try {
      const result = await pool.query(
        'UPDATE alerts SET is_read = false WHERE id = $1 RETURNING *',
        [id]
      );
      if (result.rows.length === 0) {
        return { success: false, error: 'Alert not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати кількість непрочитаних
  static async getUnreadCount(userId = null) {
    try {
      if (userId) {
        const result = await pool.query(
          `SELECT COUNT(a.*)::int AS count FROM alerts a
           JOIN devices d ON a.device_id = d.id
           JOIN rooms r ON d.room_id = r.id
           WHERE r.user_id = $1 AND a.is_read = false`,
          [userId]
        );
        return { success: true, data: { unread: result.rows[0].count } };
      }
      const result = await pool.query('SELECT COUNT(*)::int AS count FROM alerts WHERE is_read = false');
      return { success: true, data: { unread: result.rows[0].count } };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Видалити
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM alerts WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'Alert not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = Alert;
