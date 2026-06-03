const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  static async register(email, password, full_name) {
    try {
      const password_hash = await bcrypt.hash(password, 10);
      const id = uuidv4();
      
      const result = await pool.query(
        'INSERT INTO users (id, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, created_at',
        [id, email, password_hash, full_name]
      );
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static async login(email, password) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!validPassword) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      return {
        success: true,
        data: {
          token: uuidv4(),
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: 'user'
          }
        }
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати всіх
  static async getAll() {
    try {
      const result = await pool.query('SELECT id, email, full_name, created_at FROM users ORDER BY created_at DESC');
      return { success: true, data: result.rows };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Отримати по ID
  static async getById(id) {
    try {
      const result = await pool.query('SELECT id, email, full_name, created_at FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Оновити
  static async update(id, email, full_name) {
    try {
      const result = await pool.query(
        'UPDATE users SET email = $1, full_name = $2 WHERE id = $3 RETURNING id, email, full_name, created_at',
        [email, full_name, id]
      );
      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Змінити пароль
  static async changePassword(id, newPassword) {
    try {
      const password_hash = await bcrypt.hash(newPassword, 10);
      const result = await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, email',
        [password_hash, id]
      );
      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Видалити
  static async delete(id) {
    try {
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, email, full_name', [id]);
      if (result.rows.length === 0) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: result.rows[0] };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

module.exports = User;
