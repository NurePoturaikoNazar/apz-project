const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Device {
  // Створити
  static async create(roomId, name, macAddress, type) {
    try {
      const id = uuidv4();
      const result = await pool.query(
        'INSERT INTO devices (id, room_id, name, mac_address, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, roomId, name, macAddress, type]
      );
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати всі
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM devices ORDER BY created_at DESC');
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати по ID
  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM devices WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'Device not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати по MAC
  static async getByMac(macAddress) {
    try {
      const result = await pool.query('SELECT * FROM devices WHERE mac_address = $1', [macAddress]);
      if (result.rows.length === 0) {
        return { success: false, error: 'Device not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Оновити
  static async update(id, roomId, name, macAddress, type, is_active) {
    try {
      const result = await pool.query(
        'UPDATE devices SET room_id = $1, name = $2, mac_address = $3, type = $4, is_active = $5 WHERE id = $6 RETURNING *',
        [roomId, name, macAddress, type, is_active, id]
      );
      if (result.rows.length === 0) {
        return { success: false, error: 'Device not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Видалити
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM devices WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'Device not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Оновити last_seen
  static async updateLastSeen(id) {
    try {
      await pool.query('UPDATE devices SET last_seen = NOW() WHERE id = $1', [id]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = Device;
