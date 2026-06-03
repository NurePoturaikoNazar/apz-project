// трешолди для алертів
const THRESHOLDS = {
  TEMP_MIN: 16,
  TEMP_MAX: 28,
  HUMIDITY_MIN: 30,
  HUMIDITY_MAX: 70,
  SOUND_MAX: 80,
  LIGHT_MIN: 100,
};

// девайси
const DEVICE_TYPES = [
  'temperature_sensor',
  'humidity_sensor',
  'light_sensor',
  'sound_sensor',
  'camera',
  'multi_sensor',
];

// руми ? мб афуера і інпут
const ROOM_TYPES = [
  'living_room',
  'bedroom',
  'kitchen',
  'bathroom',
  'office',
  'storage',
  'hall',
];

module.exports = {
  THRESHOLDS,
  DEVICE_TYPES,
  ROOM_TYPES,
};
