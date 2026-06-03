const Room = require('../models/Room');
const pool = require('../config/database');

exports.create = async (req, res) => {
  const { userId, name, type, description } = req.body;
  const result = await Room.create(userId, name, type, description);
  
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json(result.data);
};

exports.getAll = async (req, res) => {
  const result = await Room.getAll();
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const result = await Room.getById(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, type, description } = req.body;
  const result = await Room.update(id, name, type, description);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    // === ТРАНЗАКЦІЯ ===
    await client.query('BEGIN');

    // Перевіряємо чи кімната існує
    const roomCheck = await client.query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (roomCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Room not found' });
    }
    const room = roomCheck.rows[0];

    // Знайти всі пристрої цієї кімнати
    const devicesResult = await client.query('SELECT id FROM devices WHERE room_id = $1', [id]);
    const deviceIds = devicesResult.rows.map(d => d.id);

    // Видалити всі залежні дані (順序 має значення!)
    if (deviceIds.length > 0) {
      // Видалити алерти для цих пристроїв
      await client.query('DELETE FROM alerts WHERE device_id = ANY($1)', [deviceIds]);
      
      // Видалити снімки для цих пристроїв
      await client.query('DELETE FROM snapshots WHERE device_id = ANY($1)', [deviceIds]);
      
      // Видалити вимірювання для цих пристроїв
      await client.query('DELETE FROM measurements WHERE device_id = ANY($1)', [deviceIds]);
      
      // Видалити сами пристрої
      await client.query('DELETE FROM devices WHERE id = ANY($1)', [deviceIds]);
    }

    // Видалити кімнату
    await client.query('DELETE FROM rooms WHERE id = $1', [id]);

    // Зафіксувати всі зміни
    await client.query('COMMIT');

    res.json({ 
      message: 'Room and all related data deleted successfully', 
      room: room,
      deleted: {
        devices: deviceIds.length,
      }
    });

  } catch (error) {
    // Скасувати всі зміни при помилці
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    res.status(500).json({ 
      error: 'Failed to delete room',
      message: error.message 
    });
  } finally {
    client.release();
  }
};
