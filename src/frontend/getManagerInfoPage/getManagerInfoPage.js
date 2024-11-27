import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // for the searchable dropdown
import './getManagerInfoPage.css'; // Import the custom CSS file

const GetManagerInfoPage = () => {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managerInfo, setManagerInfo] = useState({
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
      setManagerInfo({
        name,
        email,
        phone,
        department,
      });
    } else {
      // Reset manager info when no manager is selected
      setManagerInfo({
        name: '',
        email: '',
        phone: '',
        department: '',
      });
    }
  };

  return (
    <div className="get-manager-info-container">
      <h2 className="get-manager-info-title">Get Manager Information</h2>
      <form className="get-manager-info-form">
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
          <div className="manager-info-display">
            <div className="manager-info-item">
              <strong>Name:</strong> {managerInfo.name}
            </div>
            <div className="manager-info-item">
              <strong>Email:</strong> {managerInfo.email}
            </div>
            <div className="manager-info-item">
              <strong>Phone:</strong> {managerInfo.phone}
            </div>
            <div className="manager-info-item">
              <strong>Department:</strong> {managerInfo.department}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default GetManagerInfoPage;
