import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // for the searchable dropdown
import './updateManager.css'; // Import the custom CSS file

const UpdateManagerPage = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
  });

  // Fetch all managers from API
  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/managers/getAllMangers');
      const data = await response.json();
      const formattedManagers = data.map((manager) => ({
        value: manager._id,
        label: `${manager.name}`, // Modify label to show name
        ...manager, // Include full manager data
      }));
      setManagers(formattedManagers);
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []); // Fetch managers only on initial render

  // Handle the selection of a manager
  const handleManagerChange = (selectedOption) => {
    setSelectedManager(selectedOption);

    if (selectedOption) {
      const { name, email, phone, department } = selectedOption; // Extract manager data
      setUpdatedData({
        name,
        email,
        phone,
        department,
      });
    } else {
      // Reset data when no manager is selected
      setUpdatedData({
        name: '',
        email: '',
        phone: '',
        department: '',
      });
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (update manager)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedManager) return; // Make sure a manager is selected

    try {
      const response = await fetch(`http://localhost:5000/api/managers/${selectedManager.value}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Manager updated successfully!');
        // Reset form and selected manager
        setUpdatedData({
          name: '',
          email: '',
          phone: '',
          department: '',
        });
        setSelectedManager(null);
        
        // Refetch managers after update
        fetchManagers();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating manager:', error);
      alert('Failed to update manager');
    }
  };

  return (
    <div className="update-manager-container">
      <h2 className="update-manager-title">Update Manager</h2>
      <form onSubmit={handleSubmit} className="update-manager-form">
        <label className="input-label">Select Manager</label>
        <div className="select-container">
          <Select
            options={managers}
            value={selectedManager}
            onChange={handleManagerChange}
            placeholder="Search for a manager..."
            isSearchable
            isDisabled={managers.length === 0} // Disable when no managers are available
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#4a5568',  // Tailwind gray-700
                borderColor: '#2d3748',      // Tailwind gray-800
                color: '#fff',
                boxShadow: 'none',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? '#2d3748' : '#4a5568',  // Selected state: gray-800, default: gray-700
                color: '#fff',
              }),
              singleValue: (base) => ({
                ...base,
                color: '#fff',
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: '#fff',
              }),
              placeholder: (base) => ({
                ...base,
                color: '#aaa', // Light gray placeholder
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#2d3748', // Tailwind gray-800 for menu background
                borderRadius: 4,
              }),
            }}
          />
        </div>

        {selectedManager && (
          <>
            <label className="input-label">Name</label>
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter manager's name"
            />

            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={updatedData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter manager's email"
            />

            <label className="input-label">Phone</label>
            <input
              type="text"
              name="phone"
              value={updatedData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter manager's phone"
            />

            <label className="input-label">Department</label>
            <input
              type="text"
              name="department"
              value={updatedData.department}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter manager's department"
            />
          </>
        )}

        <button type="submit" className="submit-btn">Update Manager</button>
      </form>
    </div>
  );
};

export default UpdateManagerPage;
