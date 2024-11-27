import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // for the searchable dropdown
import './deleteManager.css'; // Import the custom CSS file

const DeleteManagerPage = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);

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
  };

  // Handle the deletion of a manager
  const handleDelete = async (e) => {
    e.preventDefault();
    if (!selectedManager) return; // Make sure a manager is selected

    try {
      const response = await fetch(`http://localhost:5000/api/managers/${selectedManager.value}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Manager deleted successfully!');
        // Reset selected manager
        setSelectedManager(null);
        
        // Refetch managers after deletion
        fetchManagers();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting manager:', error);
      alert('Failed to delete manager');
    }
  };

  return (
    <div className="delete-manager-container">
      <h2 className="delete-manager-title">Delete Manager</h2>
      <form onSubmit={handleDelete} className="delete-manager-form">
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

        <button type="submit" className="submit-btn">Delete Manager</button>
      </form>
    </div>
  );
};

export default DeleteManagerPage;
