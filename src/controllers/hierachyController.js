// const Employee = require('../models/Employee');
// const Manager = require('../models/Manager');

// // Helper function to build hierarchy recursively
// // Helper function to build hierarchy recursively
// const buildHierarchy = (managers, employees, parentManagerId = null) => {
//     return managers
//       .filter(manager => parentManagerId ? manager.managerId && manager.managerId.equals(parentManagerId) : !manager.managerId)
//       .map(manager => ({
//         name: manager.name,
//         email: manager.email,
//         phone: manager.phone,
//         department: manager.department,
//         role: 'manager',  // Adding role as 'manager'
//         children: [
//           ...employees
//             .filter(emp => emp.managerId && emp.managerId.equals(manager._id))
//             .map(emp => ({
//               name: emp.name,
//               phone: emp.phone,
//               department: emp.department,
//               role: 'employee',  // Adding role as 'employee'
//             })),
//           ...buildHierarchy(managers, employees, manager._id), // Recursively build for nested managers
//         ],
//       }));
//   };
  
//   // API to get the hierarchy
//   exports.getHierarchy = async (req, res) => {
//     try {
//       // Fetch all employees and managers
//       const employees = await Employee.find();
//       const managers = await Manager.find();
  
//       // Build the hierarchy tree starting with top-level managers (no parent manager)
//       const hierarchy = buildHierarchy(managers, employees);
  
//       // Return the hierarchy as a response
//       res.status(200).json(hierarchy);
//     } catch (error) {
//       console.error('Error fetching hierarchy:', error);
//       res.status(500).json({ message: 'Error fetching hierarchy', error });
//     }
//   };
  
const Manager = require('../models/Manager');

// Helper function to build hierarchy recursively from the Manager table
const buildHierarchy = (managers, parentManagerId = null) => {
    return managers
      .filter(manager => parentManagerId ? manager.managerId && manager.managerId.equals(parentManagerId) : !manager.managerId)
      .map(manager => {
        // Find employees associated with this manager
        const children = managers.filter(emp => emp.managerId && emp.managerId.equals(manager._id));
        
        // Check if manager has any employees, else treat them as an employee
        const role = children.length > 0 ? 'manager' : 'employee';

        return {
          name: manager.name,
          email: manager.email,
          phone: manager.phone,
          department: manager.department,
          role: role,  // Adding role as 'manager' or 'employee'
          children: buildHierarchy(managers, manager._id), // Recursively build for nested managers
        };
      });
};
  
// API to get the hierarchy
exports.getHierarchy = async (req, res) => {
  try {
    // Fetch all managers (no need to fetch employees)
    const managers = await Manager.find();
  
    // Build the hierarchy tree starting with top-level managers (no parent manager)
    const hierarchy = buildHierarchy(managers);
  
    // Return the hierarchy as a response
    res.status(200).json(hierarchy);
  } catch (error) {
    console.error('Error fetching hierarchy:', error);
    res.status(500).json({ message: 'Error fetching hierarchy', error });
  }
};
