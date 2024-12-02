import React from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate = useNavigate(); 


 const handleManager = () => {
    navigate("/dashboard-managers"); 
  };  
  const handleEmployee = () => {
    navigate("/dashboard-employees");
  }; 
  const handleDepartment = () => {
    navigate("/dashboard-department");
  }; 
  const handleHierarchy = () => {
    navigate("/hierarchy-page");
  };
  return (
    <div className="container">
      <h1 className="title">Manage Employees and Managers</h1>
      <div className="button-container">
        <button onClick={handleManager} className="btn add-manager">Show All Managers or Employees</button>
      </div>
      <br />
      <div className="button-container">
        <button onClick={handleDepartment} className="btn add-manager">Department</button>
        <button onClick={handleHierarchy} className="btn add-employee">Hierarchy</button>
      </div>
    </div>
  );
};

export default Homepage;
