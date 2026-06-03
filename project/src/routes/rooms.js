const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const telemetryController = require('../controllers/telemetryController');

router.post('/', roomController.create);
router.get('/', roomController.getAll);
router.get('/:id', roomController.getById);
router.get('/:roomId/telemetry', telemetryController.getRoomTelemetry);
router.put('/:id', roomController.update);
router.delete('/:id', roomController.delete);

module.exports = router;
