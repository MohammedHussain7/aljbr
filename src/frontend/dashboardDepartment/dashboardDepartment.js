import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaPlus } from 'react-icons/fa';
import './dashboard.css';

const DepartmentDashboardPage = () => {
  const [departments, setDepartments] = useState([]);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editedDepartment, setEditedDepartment] = useState({});
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/department');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedDepartment({ ...editedDepartment, [name]: value });
  };

  const handleEdit = (department) => {
    setEditingDepartmentId(department._id);
    setEditedDepartment(department); // Set data for editing
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/department/${editedDepartment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedDepartment),
      });

      if (response.ok) {
        alert('Department updated successfully!');
        fetchDepartments();
        setEditingDepartmentId(null); // Reset the editing state
      } else {
        alert('Failed to update department');
      }
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Failed to update department');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/department/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Department deleted successfully!');
        fetchDepartments();
      } else {
        alert('Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department');
    }
  };

  const handleNewDepartmentChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment({ ...newDepartment, [name]: value });
  };

  const handleAddDepartment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDepartment),
      });

      if (response.ok) {
        alert('New department added successfully!');
        fetchDepartments();
        setShowAddForm(false);
        setNewDepartment({ name: '', description: '' });
      } else {
        alert('Failed to add department');
      }
    } catch (error) {
      console.error('Error adding department:', error);
      alert('Failed to add department');
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Departments Dashboard</h2>

      {/* Add New Department Button */}
      <div className="add-department-btn-container">
        <button onClick={() => setShowAddForm(!showAddForm)} className="update-btn">
          <FaPlus /> Add New Department
        </button>
      </div>

      {/* Add New Department Form */}
      {showAddForm && (
        <div className="add-department-form">
          <input
            type="text"
            name="name"
            placeholder="Department Name"
            value={newDepartment.name}
            onChange={handleNewDepartmentChange}
            className="edit-input"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newDepartment.description}
            onChange={handleNewDepartmentChange}
            className="edit-input"
          ></textarea>
          <button onClick={handleAddDepartment} className="save-btn">
            <FaSave /> Save New Department
          </button>
        </div>
      )}

      {/* Departments Table or No Departments Found */}
      {departments.length > 0 ? (
        <table className="managers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                <td>
                  {editingDepartmentId === department._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedDepartment.name}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    department.name
                  )}
                </td>
                <td>
                  {editingDepartmentId === department._id ? (
                    <textarea
                      name="description"
                      value={editedDepartment.description}
                      onChange={handleEditChange}
                      className="edit-input"
                    ></textarea>
                  ) : (
                    department.description
                  )}
                </td>
                <td>
                  {editingDepartmentId === department._id ? (
                    <button className="save-btn" onClick={handleSave}>
                      <FaSave />
                    </button>
                  ) : (
                    <>
                      <button className="update-btn" onClick={() => handleEdit(department)}>
                        <FaEdit />
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(department._id)}>
                        <FaTrashAlt />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-departments-message">No departments found.</p>
      )}
    </div>
  );
};

export default DepartmentDashboardPage;
