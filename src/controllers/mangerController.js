const mongoose = require('mongoose');
const Manager = require('../models/Manager');
const Employee = require('../models/Employee');


exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mana', error });
  }
};

// Get all managers or filter by manager ID (optional)
exports.getManagers = async (req, res) => {
  try {
    const { page = 1, limit = 10, managerId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // If managerId is provided, filter by it, otherwise get all managers
    const query = managerId ? { _id: managerId } : {};

    // Fetch the managers with pagination and optional managerId filter
    const managers = await Manager.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    // Get the total count of managers for pagination
    const totalManagers = await Manager.countDocuments(query);

    res.status(200).json({
      managers,
      totalPages: Math.ceil(totalManagers / parseInt(limit)),
      currentPage: parseInt(page),
      totalManagers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting managers', error });
  }
};

// Get a single manager by manager ID
exports.getManagerById = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.status(200).json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Error getting manager', error });
  }
};

// Add a new manager
exports.addManager = async (req, res) => {
  console.log(req.body);

  // If managerId is not provided, we don't include it in the manager object
  const managerData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    department: req.body.department,
    managerId: req.body.managerId || undefined, // If managerId is not provided, set it to undefined
  };

  try {
    const manager = new Manager(managerData);
    await manager.save();
    res.status(201).json(manager);
  } catch (error) {
    res.status(500).json({ message: 'Error creating manager', error });
  }
};


// Update an existing manager
exports.updateManager = async (req, res) => {
  console.log(req.body);
  try {
    
    const updatedManager = await Manager.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedManager) return res.status(404).json({ message: 'Manager not found' });
    res.status(200).json(updatedManager);
  } catch (error) {
    res.status(500).json({ message: 'Error updating manager', error });
  }
};

// Delete a manager
exports.deleteManager = async (req, res) => {
  try {
    // Check if the manager has employees reporting to them
    const employees = await Employee.find({ managerId: req.params.id });
    if (employees.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete manager as employees are assigned to them',
      });
    }

    const manager = await Manager.findByIdAndDelete(req.params.id);
    if (!manager) return res.status(404).json({ message: 'Manager not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting manager', error });
  }
};

// Get all employees reporting to a specific manager
exports.getEmployeesByManager = async (req, res) => {
  try {
    const employees = await Employee.find({ managerId: req.params.id });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error getting employees for manager', error });
  }
};
// const Department = require('../models/Department'); // Assuming you have a Department model

exports.getManagersByDepartment = async (req, res) => {
  const { department } = req.params;

  try {
    // Step 1: Find the department by its name to get its ID


    // Step 3: Fetch managers based on the department's ID
    const managers = await Manager.find({ department: department });

    res.status(200).json({ managers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching managers', error });
  }
};
 