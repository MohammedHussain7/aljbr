import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaPlus } from 'react-icons/fa';
import './dashboard.css';

const EmployeeDashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', phone: '', department: '', managerId: '' });

  // Fetch employees and managers
  const fetchEmployees = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees?page=${page}&limit=${limit}`);
      const data = await response.json();
      setEmployees(data.employees);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/managers/getAllMangers');
      const data = await response.json();
      setManagers(data.managers);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage, limit);
    fetchManagers();
  }, [currentPage, limit]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.managerId && managers.find((manager) => manager._id === employee.managerId) &&
      managers.find((manager) => manager._id === employee.managerId).name.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Employee deleted successfully!');
        fetchEmployees(currentPage, limit);
      } else {
        alert('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee({ ...editedEmployee, [name]: value });
  };

  const handleEdit = (employee) => {
    setEditingEmployeeId(employee._id);
    setEditedEmployee(employee);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${editedEmployee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedEmployee),
      });

      if (response.ok) {
        alert('Employee updated successfully!');
        fetchEmployees(currentPage, limit);
        setEditingEmployeeId(null);
      } else {
        alert('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || employees.length === 0) return;
    setCurrentPage(page);
  };

  const isPrevDisabled = currentPage === 1 || employees.length === 0;
  const isNextDisabled = currentPage === totalPages || employees.length === 0;

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployee = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        alert('New employee added successfully!');
        fetchEmployees(currentPage, limit);
        setShowAddForm(false);
        setNewEmployee({ name: '', email: '', phone: '', department: '', managerId: '' });
      } else {
        alert('Failed to add employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Employees Dashboard</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, email, phone, department, or manager..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      {/* Managers Per Page Dropdown */}
      <div className="limit-container">
        <label htmlFor="limit">Employees per page:</label>
        <select id="limit" value={limit} onChange={handleLimitChange} className="limit-dropdown">
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
        </select>
      </div>

      {/* Add New Employee Button */}
      <div className="add-manager-btn-container">
        <button onClick={() => setShowAddForm(!showAddForm)} className="update-btn">
          <FaPlus /> Add New Employee
        </button>
      </div>

      {/* Add New Employee Form */}
      {showAddForm && (
        <div className="add-manager-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newEmployee.name}
            onChange={handleNewEmployeeChange}
            className="edit-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={handleNewEmployeeChange}
            className="edit-input"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={newEmployee.phone}
            onChange={handleNewEmployeeChange}
            className="edit-input"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={newEmployee.department}
            onChange={handleNewEmployeeChange}
            className="edit-input"
          />
          <select
            name="managerId"
            value={newEmployee.managerId}
            onChange={handleNewEmployeeChange}
            className="edit-input"
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager._id} value={manager._id}>
                {manager.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddEmployee} className="save-btn">
            <FaSave /> Save New Employee
          </button>
        </div>
      )}

      {/* Employees Table */}
      <table className="managers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Manager</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>
                {editingEmployeeId === employee._id ? (
                  <input
                    type="text"
                    name="name"
                    value={editedEmployee.name}
                    onChange={handleEditChange}
                    className="edit-input"
                  />
                ) : (
                  employee.name
                )}
              </td>
              <td>
                {editingEmployeeId === employee._id ? (
                  <input
                    type="email"
                    name="email"
                    value={editedEmployee.email}
                    onChange={handleEditChange}
                    className="edit-input"
                  />
                ) : (
                  employee.email
                )}
              </td>
              <td>
                {editingEmployeeId === employee._id ? (
                  <input
                    type="text"
                    name="phone"
                    value={editedEmployee.phone}
                    onChange={handleEditChange}
                    className="edit-input"
                  />
                ) : (
                  employee.phone
                )}
              </td>
              <td>
                {editingEmployeeId === employee._id ? (
                  <input
                    type="text"
                    name="department"
                    value={editedEmployee.department}
                    onChange={handleEditChange}
                    className="edit-input"
                  />
                ) : (
                  employee.department
                )}
              </td>
              <td>
                {editingEmployeeId === employee._id ? (
                  <select
                    name="managerId"
                    value={editedEmployee.managerId}
                    onChange={handleEditChange}
                    className="edit-input"
                  >
                    <option value="">Select Manager</option>
                    {managers.map((manager) => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  employee.managerId
                    ? managers.find((manager) => manager._id === employee.managerId)?.name || 'N/A'
                    : 'N/A'
                )}
              </td>
              <td>
                {editingEmployeeId === employee._id ? (
                  <button onClick={handleSave} className="save-btn">
                    <FaSave />
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(employee)} className="edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(employee._id)} className="delete-btn">
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={isPrevDisabled}>
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={isNextDisabled}>
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;
