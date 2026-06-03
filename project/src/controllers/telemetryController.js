const Device = require('../models/Device');
const Measurement = require('../models/Measurement');
const Alert = require('../models/Alert');
const { THRESHOLDS } = require('../utils/constants');

// Regex для валідації MAC-адреси
const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

exports.recordTelemetry = async (req, res) => {
  const { macAddress, temperature, humidity, lightLevel, soundLevel } = req.body;

  // === 1. ВАЛІДАЦІЯ ВХІДНИХ ДАНИХ ===
  // Перевіряємо MAC-адресу
  if (!macAddress || typeof macAddress !== 'string' || !MAC_REGEX.test(macAddress)) {
    return res.status(400).json({ 
      error: 'Invalid MAC address format. Expected: AA:BB:CC:DD:EE:FF'
    });
  }

  // Перевіряємо числові значення
  if (typeof temperature !== 'number') {
    return res.status(400).json({ error: 'temperature must be a number' });
  }
  if (typeof humidity !== 'number') {
    return res.status(400).json({ error: 'humidity must be a number' });
  }
  if (typeof lightLevel !== 'number') {
    return res.status(400).json({ error: 'lightLevel must be a number' });
  }
  if (typeof soundLevel !== 'number') {
    return res.status(400).json({ error: 'soundLevel must be a number' });
  }

  // Перевіряємо діапазони
  if (temperature < -50 || temperature > 150) {
    return res.status(400).json({ error: 'temperature out of range (-50 to 150)' });
  }
  if (humidity < 0 || humidity > 100) {
    return res.status(400).json({ error: 'humidity out of range (0 to 100)' });
  }
  if (lightLevel < 0 || lightLevel > 10000) {
    return res.status(400).json({ error: 'lightLevel out of range (0 to 10000)' });
  }
  if (soundLevel < 0 || soundLevel > 150) {
    return res.status(400).json({ error: 'soundLevel out of range (0 to 150)' });
  }

  try {
    // 2. Знайти пристрій
    const deviceResult = await Device.getByMac(macAddress);
    if (!deviceResult.success) {
      return res.status(404).json({ error: 'Device not found' });
    }
    const deviceId = deviceResult.data.id;

    // 3. Оновити last_seen
    await Device.updateLastSeen(deviceId);

    // 4. Записати вимірювання
    const measurementResult = await Measurement.create(deviceId, temperature, humidity, lightLevel, soundLevel);
    if (!measurementResult.success) {
      return res.status(500).json({ error: measurementResult.error });
    }

    // === 5. ПЕРЕВІРИТИ ПОРОГИ З DEBOUNCE ===
    
    // Температура низька
    if (temperature < THRESHOLDS.TEMP_MIN) {
      const hasRecent = await Alert.checkRecentAlert(deviceId, 'TEMPERATURE_LOW', 15);
      if (!hasRecent) {
        await Alert.create(
          deviceId,
          'TEMPERATURE_LOW',
          `⚠️ Температура занадто низька: ${temperature}°C (мін: ${THRESHOLDS.TEMP_MIN}°C)`
        );
      }
    }

    // Температура висока
    if (temperature > THRESHOLDS.TEMP_MAX) {
      const hasRecent = await Alert.checkRecentAlert(deviceId, 'TEMPERATURE_HIGH', 15);
      if (!hasRecent) {
        await Alert.create(
          deviceId,
          'TEMPERATURE_HIGH',
          `⚠️ Температура занадто висока: ${temperature}°C (макс: ${THRESHOLDS.TEMP_MAX}°C)`
        );
      }
    }

    // Вологість низька
    if (humidity < THRESHOLDS.HUMIDITY_MIN) {
      const hasRecent = await Alert.checkRecentAlert(deviceId, 'HUMIDITY_LOW', 15);
      if (!hasRecent) {
        await Alert.create(
          deviceId,
          'HUMIDITY_LOW',
          `⚠️ Вологість занадто низька: ${humidity}% (мін: ${THRESHOLDS.HUMIDITY_MIN}%)`
        );
      }
    }

    // Вологість висока
    if (humidity > THRESHOLDS.HUMIDITY_MAX) {
      const hasRecent = await Alert.checkRecentAlert(deviceId, 'HUMIDITY_HIGH', 15);
      if (!hasRecent) {
        await Alert.create(
          deviceId,
          'HUMIDITY_HIGH',
          `⚠️ Вологість занадто висока: ${humidity}% (макс: ${THRESHOLDS.HUMIDITY_MAX}%)`
        );
      }
    }

    // Шум критичний
    if (soundLevel > THRESHOLDS.SOUND_MAX) {
      const hasRecent = await Alert.checkRecentAlert(deviceId, 'SOUND', 15);
      if (!hasRecent) {
        await Alert.create(
          deviceId,
          'SOUND',
          `⚠️ Рівень шуму критичний: ${soundLevel}dB (макс: ${THRESHOLDS.SOUND_MAX}dB)`
        );
      }
    }

    // Освітлення низьке
    if (lightLevel < THRESHOLDS.LIGHT_MIN) {
      const hasRecent = await Alert.checkRecentAlert(deviceId, 'LIGHT', 15);
      if (!hasRecent) {
        await Alert.create(
          deviceId,
          'LIGHT',
          `⚠️ Рівень освітлення низький: ${lightLevel} lux (мін: ${THRESHOLDS.LIGHT_MIN} lux)`
        );
      }
    }

    console.log(`📡 Data received from ${macAddress}: Temp=${temperature}°C, Humidity=${humidity}%`);
    res.status(201).json({ status: 'success', data: measurementResult.data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const { deviceId } = req.params;
  const { limit = 100, offset = 0 } = req.query;
  const result = await Measurement.getByDeviceId(deviceId, limit, offset);
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};

exports.getRoomTelemetry = async (req, res) => {
  const { roomId } = req.params;
  const { limit = 100 } = req.query;
  const result = await Measurement.getHistoryByRoom(roomId, parseInt(limit, 10));
  
  if (!result.success) {
    return res.status(500).json({ error: result.error });
  }
  res.json(result.data);
};
