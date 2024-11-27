const Department = require('../models/Department'); // Import the Department model

// Fetch all departments
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error });
  }
};

// Fetch a single department by ID
const getDepartmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department', error });
  }
};

// Add a new department
const addDepartment = async (req, res) => {
  const { name, description } = req.body;
  console.log(req.body);
  try {
    const newDepartment = new Department({ name, description });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ message: 'Error ad ding department', error });
  }
};

// Update a department by ID
const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const department = await Department.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true } // Return the updated document
    );
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: 'Error updating department', error });
  }
};

// Delete a department by ID
const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department', error });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
