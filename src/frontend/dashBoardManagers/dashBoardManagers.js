import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaPlus } from 'react-icons/fa';
import './dashboard.css';

const DashboardPage = () => {
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingManagerId, setEditingManagerId] = useState(null);
  const [editedManager, setEditedManager] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newManager, setNewManager] = useState({ name: '', email: '', phone: '', department: '', managerId: '' , role: ''});  
  const [selectedDepartment, setSelectedDepartment] = useState(''); // New state for the selected department
  const [selectedRole, setSelectedRole] = useState(''); // New state for the selected department
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [employeeList, setEmployeeList] = useState([]); // State for employee list
  // const [role, setRole] = useState(''); // State for role
  const allRoles = [ 'Manager', 'Employee']; // All possible roles
  const mongoose = require('mongoose');

  // Fetch managers and departments
  const fetchManagers = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`http://localhost:5000/api/managers/getAllMangers?page=${page}&limit=${limit}`);
      const data = await response.json();
      setManagers(data.managers);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/department');
      const data = await response.json();
      setDepartments(data); // Assuming the response is an array of departments
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchManagers(currentPage, limit); // Fetch managers on load
    fetchDepartments(); // Fetch departments on load
  }, [currentPage, limit]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter managers based on search term
  // const filteredManagers = managers.filter((manager) =>
  //   manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   manager.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   manager.department.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredManagers = managers.filter((manager) => {
    // Lowercase the search term for case-insensitive comparison
    const searchLower = searchTerm.toLowerCase();
  
    // Check if the manager's fields match the search term, adding safety checks
    const matchesName = manager.name?.toLowerCase().includes(searchLower);
    const matchesEmail = manager.email?.toLowerCase().includes(searchLower);
    const matchesPhone = manager.phone?.toLowerCase().includes(searchLower);
    const matchesRole = manager.role?.toLowerCase().includes(searchLower);
    const matchesManager = manager.managerId && 
    managers.some((otherManager) => {
      const isMatchingId = (manager.managerId instanceof mongoose.Types.ObjectId && 
        otherManager._id instanceof mongoose.Types.ObjectId) 
        ? otherManager._id.equals(manager.managerId) 
        : otherManager._id.toString() === manager.managerId.toString();
        
      return isMatchingId && 
        otherManager.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    const matchesDepartment = departments.some((department) => {
      // Check if the department matches by _id and search term in department name
      const isMatch = department._id.toString() === manager.department.toString() && 
                      department.name.toLowerCase().includes(searchLower);
    
      if (isMatch) {
        console.log('matchesManager:', department.name);  // Log department name when there's a match
      }
    
      return isMatch;
    });
  
    // Check if the managerId name matches (if managerId exists)
    // const matchesManager = manager.managerId?.name?.toLowerCase().includes(searchLower);
  
    return (
      matchesName ||
      matchesEmail ||
      matchesPhone ||
      matchesRole ||
      matchesDepartment ||
      matchesManager
    );
  });
  
  

  // Handle delete manager
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/managers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Manager deleted successfully!');
        fetchManagers(currentPage, limit);
      } else {
        alert('Failed to delete manager');
      }
    } catch (error) {
      console.error('Error deleting manager:', error);
      alert('Failed to delete manager');
    }
  };
  const handleShow = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/managers/${id}/employees`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setEmployeeList(data); // Store the employee list
          setModalVisible(true); // Show the modal
        } else {
          alert('No employees reported by this manager.');
        }
      } else {
        alert('Failed to fetch employees for this manager.');
      }
    } catch (error) {
      console.error('Error getting manager:', error);
      alert('An error occurred while fetching employees for this manager.');
    }
  };
  // Handle editing input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedManager({
      ...editedManager,
      [name]: value,
    });
  };

  // Start editing a manager
  const handleEdit = (manager) => {
    setEditingManagerId(manager._id);
    setEditedManager(manager);
  };

  // Save edited manager data
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/managers/${editedManager._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedManager),
      });
  
      if (response.ok) {
        alert('Manager updated successfully!');
        fetchManagers(currentPage, limit);
        setEditingManagerId(null); // Reset editing state
      } else {
        alert('Failed to update manager');
      }
    } catch (error) {
      console.error('Error updating manager:', error);
      alert('Failed to update manager');
    }
  };
  

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when limit changes
  };

  // Handle form input change for new manager
  const handleNewManagerChange = (e) => {
    const { name, value } = e.target;
    setNewManager({
      ...newManager,
      [name]: value,
    });
  };

  // Handle department change for new manager
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setNewManager({
      ...newManager,
      department: departmentId,
    });
    setSelectedDepartment(departmentId); // Update selected department
  };
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setNewManager({
      ...newManager,
      role: role,
    });
    setSelectedRole(role); // Update selected department
  };
  

  // Add a new manager
  const handleAddManager = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/managers/addManger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newManager),
      });

      if (response.ok) {
        alert('New manager added successfully!');
        fetchManagers(currentPage, limit);
        setShowAddForm(false);
        setNewManager({ name: '', email: '', phone: '', department: '', managerId: '', role: '' }); // Reset form
      } else {
        alert('Failed to add manager');
      }
    } catch (error) {
      console.error('Error adding manager:', error);
      alert('Failed to add manager');
    }
  };

  // Filter managers to show only those in the selected department
  const filteredManagersByDepartment = managers.filter(manager =>
    !selectedDepartment || manager.department === selectedDepartment
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, email, phone, or department..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      <div className="limit-container">
        <label htmlFor="limit">Managers per page:</label>
        <select id="limit" value={limit} onChange={handleLimitChange} className="limit-dropdown">
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      {/* Add New Manager Button */}
      <div className="add-manager-btn-container">
        <button onClick={() => setShowAddForm(!showAddForm)} className="update-btn">
          <FaPlus /> Add New Manager
        </button>
      </div>

      {/* Add New Manager Form */}
      {showAddForm && (
        <div className="add-manager-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newManager.name}
            onChange={handleNewManagerChange}
            className="edit-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newManager.email}
            onChange={handleNewManagerChange}
            className="edit-input"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newManager.phone}
            onChange={handleNewManagerChange}
            className="edit-input"
          />
          <select
            name="role"
            value={newManager.role}
            onChange={handleRoleChange} // Update department
            className="edit-input"
          >
            <option value="">Select Role</option>
            {allRoles.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            name="department"
            value={newManager.department}
            onChange={handleDepartmentChange} // Update department
            className="edit-input"
          >
            <option value="">Select Department</option>
            {departments.map(department => (
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
          <select
            name="managerId"
            value={newManager.managerId}
            onChange={handleNewManagerChange}
            className="edit-input"
          >
            <option value="">No manager</option>
            {filteredManagersByDepartment.map(manager => (
              <option key={manager._id} value={manager._id}>
                {manager.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddManager} className="save-btn">
            <FaSave /> Save New Manager
          </button>
        </div>
      )}

      <table className="managers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Manager</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredManagers.map((manager) => (
            <tr key={manager._id}>
              <td>{editingManagerId === manager._id ? <input type="text" name="name" value={editedManager.name} onChange={handleEditChange} className="edit-input" /> : manager.name}</td>
              <td>{editingManagerId === manager._id ? <input type="email" name="email" value={editedManager.email} onChange={handleEditChange} className="edit-input" /> : manager.email}</td>
              <td>{editingManagerId === manager._id ? <input type="text" name="phone" value={editedManager.phone} onChange={handleEditChange} className="edit-input" /> : manager.phone}</td>
              <td>
                {editingManagerId === manager._id ? (
                  <select name="department" value={editedManager.department} onChange={handleEditChange} className="edit-input">
                    <option value="">Select Department</option>
                    {departments.map(department => (
                      <option key={department._id} value={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  departments.find(department => department._id === manager.department)?.name || 'No department'
                )}
              </td>
              <td>
                {editingManagerId === manager._id ? (
                  <select name="managerId" value={editedManager.managerId} onChange={handleEditChange} className="edit-input">
                    <option value="">No manager</option>
                    {managers.map(manager => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  manager.managerId ? managers.find(mgr => mgr._id === manager.managerId)?.name : 'No manager'
                )}
              </td>
              <td>
  {editingManagerId === manager._id ? (
    <select
      name="role"
      value={editedManager.role}
      onChange={handleEditChange}
      className="edit-input"
    >
      <option value="">Select Role</option>
      {allRoles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  ) : (
    manager.role || 'No role'
  )}
</td>

              <td>
                {editingManagerId === manager._id ? (
                  <button className="save-btn" onClick={handleSave}>
                    <FaSave /> {/* Save Icon */}
                  </button>
                ) : (
                  <>
                    <button className="update-btn" onClick={() => handleEdit(manager)}>
                      <FaEdit /> {/* Update Icon */}
                    </button>
                    <button className="update-btn" onClick={() => handleDelete(manager._id)}>
                      <FaTrashAlt /> {/* Delete Icon */}
                    </button>
                      
                    <button className="update-btn padding" onClick={() => handleShow(manager._id)}>
                      Show Employees {/* Delete Icon */}
                    </button>
                    {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Employees reported by this manager:</h3>
            <ul>
              {employeeList.map((employee, index) => (
                <li key={employee._id}>
                  {index + 1}. {employee.name}
                </li>
              ))}
            </ul>
            <button onClick={() => setModalVisible(false)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
          Prev
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">
          Next
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
