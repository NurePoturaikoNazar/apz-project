const Alert = require('../models/Alert');

exports.create = async (req, res) => {
  const { deviceId, type, message } = req.body;
  const result = await Alert.create(deviceId, type, message);
  
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json(result.data);
};

exports.getAll = async (req, res) => {
  const { limit = 100 } = req.query;
  const result = await Alert.getAll(limit);
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getUnread = async (req, res) => {
  const result = await Alert.getUnread();
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getUnreadCount = async (req, res) => {
  const result = await Alert.getUnreadCount();
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getByDeviceId = async (req, res) => {
  const { deviceId } = req.params;
  const { limit = 50 } = req.query;
  const result = await Alert.getByDeviceId(deviceId, limit);
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;
  const result = await Alert.markAsRead(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.markAsUnread = async (req, res) => {
  const { id } = req.params;
  const result = await Alert.markAsUnread(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await Alert.delete(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ message: 'Alert deleted successfully', alert: result.data });
};
