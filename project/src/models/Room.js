const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Room {
  // Створити
  static async create(userId, name, type, description) {
    try {
      const id = uuidv4();
      const result = await pool.query(
        'INSERT INTO rooms (id, user_id, name, type, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [id, userId, name, type, description]
      );
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати всі з пристроями (з фільтрацією по юзеру)
  static async getAll(userId = null) {
    try {
      let roomsQuery;
      if (userId) {
        roomsQuery = await pool.query('SELECT * FROM rooms WHERE user_id = $1', [userId]);
      } else {
        roomsQuery = await pool.query('SELECT * FROM rooms');
      }
      const rooms = roomsQuery.rows;

      for (let room of rooms) {
        const devices = await pool.query('SELECT * FROM devices WHERE room_id = $1', [room.id]);
        room.devices = devices.rows;
      }
      return { success: true, data: rooms };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати по ID з пристроями
  static async getById(id) {
    try {
      const roomRes = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
      if (roomRes.rows.length === 0) {
        return { success: false, error: 'Room not found' };
      }
      const devicesRes = await pool.query('SELECT * FROM devices WHERE room_id = $1', [id]);
      const room = roomRes.rows[0];
      room.devices = devicesRes.rows;
      return { success: true, data: room };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Оновити
  static async update(id, name, type, description) {
    try {
      const result = await pool.query(
        'UPDATE rooms SET name = $1, type = $2, description = $3 WHERE id = $4 RETURNING *',
        [name, type, description, id]
      );
      if (result.rows.length === 0) {
        return { success: false, error: 'Room not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Видалити
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'Room not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = Room;
