const Employee = require('../models/Employee');
const Manager = require('../models/Manager');

// Get all employees

exports.getEmployees = async (req, res) => {
  try {
    // Get the page and limit from query parameters, set default values if not provided
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10 per page

    // Calculate the skip value (used for pagination)
    const skip = (page - 1) * limit;
 
    // Fetch the employees with pagination
    const employees = await Employee.find()
      .skip(skip)  // Skip the records based on the current page
      .limit(limit);  // Limit the number of records per page

    // Get the total count of employees for pagination
    const totalEmployees = await Employee.countDocuments();

    // Return the paginated data along with the total count
    res.status(200).json({ 
      employees,
      totalPages: Math.ceil(totalEmployees / limit), // Correct calculation of totalPages
      currentPage: page,
      totalEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting employees', error });
  }
};

// Get a single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('managerId');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error getting employee', error });
  }
};

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const  managerId  = req.body.managerId;
    console.log(managerId);
   

    // Check if the manager exists (if managerId is provided)
    if (managerId) {
      const manager = await Manager.findById(managerId);
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }
    }

    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee); 
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error });
  }
};

// Update an existing employee
exports.updateEmployee = async (req, res) => {
  try {
    const { managerId } = req.body;

    // Check if the manager exists (if updating managerId)
    if (managerId) {
      const manager = await Manager.findById(managerId);
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};

// Get all employees by a specific manager
exports.getEmployeesByManager = async (req, res) => {
  try {
    const employees = await Employee.find({ managerId: req.params.managerId });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error getting employees by manager', error });
  }
};

// Reassign an employee to a new manager
exports.reassignManager = async (req, res) => {
  try {
    const { employeeId, newManagerId } = req.body;

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if the new manager exists
    const manager = await Manager.findById(newManagerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    // Update the employee's manager
    employee.managerId = newManagerId;
    await employee.save();

    res.status(200).json({ message: 'Manager reassigned successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Error reassigning manager', error });
  }
};
