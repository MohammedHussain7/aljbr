import React from 'react';
import './managerActions.css'; // Import the separate CSS file
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const ManagerActions = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const handleAction = (action) => {
    alert(`You selected: ${action}`);
  };

  const addManager = ()=> {  
    navigate("/add-manager");
  }
  const updateManager = ()=> {  
    navigate("/update-manager");
  }
  const deleteManager = ()=> {  
    navigate("/delete-manager");
  }
  const showManager = ()=> {  
    navigate("/show-manager");
  }
  return (
    <div className="manager-actions-page">
      <div className="manager-actions-container">
        <h1 className="manager-actions-title">Manager Actions</h1>
        <div className="manager-actions-buttons">
          <button
            className="manager-button"
            onClick={addManager}
          >
            Add Manager
          </button> 
          <button
            className="manager-button"
            onClick={updateManager}
          >
            Update Manager
          </button>
          <button
            className="manager-button"
            onClick={deleteManager}
          >
            Delete Manager
          </button>
          <button
            className="manager-button"
            onClick={showManager}
          >
            Get Manager Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerActions;
