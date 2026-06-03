const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

router.post('/', telemetryController.recordTelemetry);
router.get('/:deviceId', telemetryController.getHistory);

module.exports = router;
