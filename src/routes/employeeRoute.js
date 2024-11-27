const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Routes
// get all employees
router.get('/', employeeController.getEmployees);
// add a new employee
router.post('/', employeeController.addEmployee);
// reassign manager for an employee
router.put('/reassign', employeeController.reassignManager);
// get an employee by ID
router.get('/:id', employeeController.getEmployeeById);
// update an employee
router.put('/:id', employeeController.updateEmployee);
// delete an employee
router.delete('/:id', employeeController.deleteEmployee);
// get employees by manager ID
router.get('/manager/:managerId', employeeController.getEmployeesByManager);

module.exports = router;
