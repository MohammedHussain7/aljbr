import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaPlus } from 'react-icons/fa'; // Importing icons for update, delete, save, and add
import './dashboard.css'; // Import the custom CSS file

const DashboardPage = () => {
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingManagerId, setEditingManagerId] = useState(null); // To track which manager is being edited
  const [editedManager, setEditedManager] = useState({}); // To store the manager's updated data
  const [currentPage, setCurrentPage] = useState(1); // Track current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [limit, setLimit] = useState(10); // Managers per page
  const [showAddForm, setShowAddForm] = useState(false); // Toggle for showing the add form
  const [newManager, setNewManager] = useState({ name: '', email: '', phone: '', department: '', managerId: '' }); // New manager data

  // Fetch managers with pagination
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

  useEffect(() => {
    fetchManagers(currentPage, limit); // Fetch managers when the component loads or page changes
  }, [currentPage, limit]); // Dependency on currentPage and limit to refetch data when changed

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter managers based on search term (search across multiple fields)
  const filteredManagers = managers.filter((manager) =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete manager (This should be an actual delete request to your API)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/managers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Manager deleted successfully!');
        fetchManagers(currentPage, limit); // Refresh the page after delete
      } else {
        alert('Failed to delete manager');
      }
    } catch (error) {
      console.error('Error deleting manager:', error);
      alert('Failed to delete manager');
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
    setEditedManager(manager); // Set the manager data in the edited state
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
        fetchManagers(currentPage, limit); // Refresh the page after update
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

  // Add a new manager
  const handleAddManager = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/managers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newManager),
      });

      if (response.ok) {
        alert('New manager added successfully!');
        fetchManagers(currentPage, limit); // Refresh the list after adding
        setShowAddForm(false); // Close the add form
        setNewManager({ name: '', email: '', phone: '', department: '', managerId: '' }); // Reset form
      } else {
        alert('Failed to add manager');
      }
    } catch (error) {
      console.error('Error adding manager:', error);
      alert('Failed to add manager');
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Managers Dashboard</h2>

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
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={newManager.department}
            onChange={handleNewManagerChange}
            className="edit-input"
          />
          <select
            name="managerId"
            value={newManager.managerId}
            onChange={handleNewManagerChange}
            className="edit-input"
          >
            <option value="">No manager</option>
            {managers.map(manager => (
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
            <th>Manager</th> {/* New column for manager */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredManagers.map((manager) => (
            <tr key={manager._id}>
              <td>{editingManagerId === manager._id ? <input type="text" name="name" value={editedManager.name} onChange={handleEditChange} className="edit-input" /> : manager.name}</td>
              <td>{editingManagerId === manager._id ? <input type="email" name="email" value={editedManager.email} onChange={handleEditChange} className="edit-input" /> : manager.email}</td>
              <td>{editingManagerId === manager._id ? <input type="text" name="phone" value={editedManager.phone} onChange={handleEditChange} className="edit-input" /> : manager.phone}</td>
              <td>{editingManagerId === manager._id ? <input type="text" name="department" value={editedManager.department} onChange={handleEditChange} className="edit-input" /> : manager.department}</td>
              <td>{editingManagerId === manager._id ? <select name="managerId" value={editedManager.managerId} onChange={handleEditChange} className="edit-input">
                <option value="">No manager</option>
                {managers.map(manager => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))}
              </select> : manager.managerId ? managers.find(mgr => mgr._id === manager.managerId)?.name : 'No manager'}</td>
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
                    <button className="delete-btn" onClick={() => handleDelete(manager._id)}>
                      <FaTrashAlt /> {/* Delete Icon */}
                    </button>
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
