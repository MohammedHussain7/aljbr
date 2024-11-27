import React from "react";
import "./homepage.css";
import { useNavigate } from "react-router-dom";
const Homepage = () => {
  const navigate = useNavigate(); 


 const handleManager = () => {
    navigate("/manager-actions");
  };  
  return (
    <div className="container">
      <h1 className="title">Manage Employees and Managers</h1>
      <div className="button-container">
        <button onClick={handleManager} className="btn add-manager">Manager</button>
        <button className="btn add-employee">Employee</button>
      </div>
    </div>
  );
};

export default Homepage;
