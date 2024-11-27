const express = require('express');
const router = express.Router();
const managerController = require('../controllers/mangerController');

// Routes
router.get('/getAllMangers', managerController.getManagers);
router.post('/addManger', managerController.addManager);
router.get('/:id', managerController.getManagerById);
router.put('/:id', managerController.updateManager);
router.delete('/:id', managerController.deleteManager);
router.get('/:id/employees', managerController.getEmployeesByManager);

module.exports = router;
