const Device = require('../models/Device');
const Snapshot = require('../models/Snapshot');
const Alert = require('../models/Alert');

exports.create = async (req, res) => {
  const { macAddress, imageUrl, reason } = req.body;
  
  try {
    const deviceResult = await Device.getByMac(macAddress);
    if (!deviceResult.success) {
      return res.status(404).json({ error: 'Device not found' });
    }
    const deviceId = deviceResult.data.id;

    const result = await Snapshot.create(deviceId, imageUrl, reason);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    if (reason === 'motion_detected') {
      const alertExists = await Alert.checkRecentAlert(deviceId, 'MOTION_DETECTED', 15);
      if (!alertExists) {
        await Alert.create(deviceId, 'MOTION_DETECTED', '⚠️ Рух виявлено на пристрої');
      }
    }

    res.status(201).json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByDeviceId = async (req, res) => {
  const { deviceId } = req.params;
  const { limit = 50 } = req.query;
  const result = await Snapshot.getByDeviceId(deviceId, limit);
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getAll = async (req, res) => {
  const { userId, limit = 50 } = req.query;
  let result;
  
  if (userId) {
    result = await Snapshot.getByUserId(userId, limit);
  } else {
    result = await Snapshot.getAll(limit);
  }
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const result = await Snapshot.delete(id);
  
  if (!result.success) {
    return res.status(404).json({ error: result.error });
  }
  res.json({ message: 'Snapshot deleted successfully', snapshot: result.data });
};
