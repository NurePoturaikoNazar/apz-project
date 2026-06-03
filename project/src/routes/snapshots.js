const express = require('express');
const router = express.Router();
const snapshotController = require('../controllers/snapshotController');

router.post('/', snapshotController.create);
router.get('/', snapshotController.getAll);
router.get('/:deviceId', snapshotController.getByDeviceId);
router.delete('/:id', snapshotController.delete);

module.exports = router;
