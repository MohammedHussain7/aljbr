const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// Routes for departments
router.get('/', departmentController.getAllDepartments); // Get all departments
router.post('/', departmentController.addDepartment); // Add a new department
router.get('/:id', departmentController.getDepartmentById); // Get a specific department by ID
router.put('/:id', departmentController.updateDepartment); // Update a department by ID
router.delete('/:id', departmentController.deleteDepartment); // Delete a department by ID

module.exports = router;
