const Device = require('../models/Device');

exports.create = async (req, res) => {
  const { roomId, name, macAddress, type } = req.body;
  const result = await Device.create(roomId, name, macAddress, type);
  
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json(result.data);
};

exports.getAll = async (req, res) => {
  const result = await Device.getAll();
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const result = await Device.getById(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getByMac = async (req, res) => {
  const { macAddress } = req.params;
  const result = await Device.getByMac(macAddress);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { roomId, name, macAddress, type, is_active } = req.body;
  const result = await Device.update(id, roomId, name, macAddress, type, is_active);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json(result.data);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await Device.delete(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ message: 'Device deleted successfully', device: result.data });
};
