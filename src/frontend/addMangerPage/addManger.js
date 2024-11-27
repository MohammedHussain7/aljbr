import React, { useState } from 'react';
import './addManger.css';

const AddManager = () => {
  const [manager, setManager] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });

  const handleChange = (e) => {
    setManager({
      ...manager,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send POST request to the backend
      const response = await fetch('http://localhost:5000/api/managers/addManger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manager), 
      }); 

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        alert('Error: ' + errorData.message);
        return;
      }

      const data = await response.json();
      console.log('Manager created:', data);

      // Reset form fields after successful submission
      setManager({
        name: '',
        email: '',
        phone: '',
        department: ''
      });

      alert('Manager added successfully!');
    } catch (error) {
      console.error('Error submitting manager:', error);
      alert('An error occurred while adding the manager');
    }
  };

  return (
    <div className="add-manager-container">
      <h2 className="add-manager-title">Add New Manager</h2>
      <form onSubmit={handleSubmit} className="add-manager-form"> 
        <label className="input-label">Name</label>
        <input
          type="text"
          name="name"
          value={manager.name}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter manager's name"
          required
        />

        <label className="input-label">Email</label>
        <input
          type="email"
          name="email"
          value={manager.email}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter manager's email"
          required
        />

        <label className="input-label">Phone</label>
        <input
          type="text"
          name="phone"
          value={manager.phone}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter manager's phone"
          required
        />

        <label className="input-label">Department</label>
        <input
          type="text"
          name="department"
          value={manager.department}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter manager's department"
          required
        />

        <button type="submit" className="submit-btn">
          Add Manager
        </button>
      </form>
    </div>
  );
};

export default AddManager;
