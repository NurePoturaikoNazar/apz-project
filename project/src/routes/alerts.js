const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.post('/', alertController.create);
router.get('/', alertController.getAll);
router.get('/unread/count', alertController.getUnreadCount);
router.get('/unread', alertController.getUnread);
router.get('/:deviceId', alertController.getByDeviceId);
router.put('/:id/read', alertController.markAsRead);
router.put('/:id/unread', alertController.markAsUnread);
router.delete('/:id', alertController.delete);

module.exports = router;
