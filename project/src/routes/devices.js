const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const telemetryController = require('../controllers/telemetryController');
const alertController = require('../controllers/alertController');

router.post('/', deviceController.create);
router.get('/', deviceController.getAll);
router.get('/by-mac/:macAddress', deviceController.getByMac);
router.get('/:id', deviceController.getById);
router.get('/:deviceId/telemetry', telemetryController.getHistory);
router.get('/:deviceId/alerts', alertController.getByDeviceId);
router.put('/:id', deviceController.update);
router.delete('/:id', deviceController.delete);

module.exports = router;
