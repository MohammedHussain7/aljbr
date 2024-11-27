const express = require('express');
const { getHierarchy } = require('../controllers/hierachyController');
const router = express.Router();

router.get('/', getHierarchy);

module.exports = router;
