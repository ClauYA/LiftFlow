const express = require('express');
const router = express.Router();
const controller = require('../controllers/menuController');

router.get('/:id', controller.getOnePlatillo);
router.post('/', controller.createPlatillo);
router.put('/:id', controller.updatePlatillo);
router.delete('/:id', controller.deletePlatillo);

module.exports = router;