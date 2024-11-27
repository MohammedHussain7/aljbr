import React, { useState, useEffect } from 'react';
import './hierarchy.css';

const EmployeeHierarchyPage = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [managerId, setManagerId] = useState('');  // Optional manager ID

  // Fetch employees and managers data
  const fetchEmployeesAndManagers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees`);
      const data = await response.json();
      setEmployees(data.employees);

      // Fetch manager names (if manager ID is provided, pass it to the API)
      const managerUrl = managerId 
        ? `http://localhost:5000/api/managers?managerId=${managerId}` 
        : 'http://localhost:5000/api/managers';
      const managerResponse = await fetch(managerUrl);
      const managerData = await managerResponse.json();
      setManagers(managerData.managers);
    } catch (error) {
      console.error('Error fetching employees and managers:', error);
    }
  };

  useEffect(() => {
    fetchEmployeesAndManagers();
  }, [managerId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleManagerIdChange = (e) => {
    setManagerId(e.target.value);  // Update manager ID for filtering
  };

  const filterAndHighlight = (employees, searchTerm, managers) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return employees.map(employee => {
      const managerName = employee.manager 
        ? managers.find(manager => manager._id === employee.manager._id)?.name
        : null;

      const isMatch = employee.name.toLowerCase().includes(lowercasedSearchTerm) || 
                      (managerName && managerName.toLowerCase().includes(lowercasedSearchTerm));

      return {
        ...employee,
        isMatch,
      };
    });
  };

  const renderHierarchy = (employee) => (
    <div key={employee._id} className={`employee ${employee.isMatch ? 'highlight' : ''}`}>
      {employee.name} {employee.manager ? ` - Managed by: ${employee.manager.name}` : ''}
    </div>
  );

  const highlightedHierarchy = filterAndHighlight(employees, searchTerm, managers);

  return (
    <div className="hierarchy-page">
      <h2 className="dashboard-title">Employees Hierarchy</h2>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by employee or manager name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      {/* Manager Filter */}
      <div className="manager-filter">
        <input
          type="text"
          placeholder="Search by manager ID (optional)"
          value={managerId}
          onChange={handleManagerIdChange}
          className="search-bar"
        />
      </div>

      {/* Display Hierarchy */}
      <div className="hierarchy-container">
        {highlightedHierarchy.map(renderHierarchy)}
      </div>
    </div>
  );
};

export default EmployeeHierarchyPage;
