// import React from 'react';
// import logo from './logo_aljbr.png'; // Import the logo
// import './App.css';
// import Homepage from './frontend/homepage/homepage';

// function App() {
//   return (
//     <div className="App">
    
//       <Homepage />
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import router
import Homepage from './frontend/homepage/homepage';
import AddManager from './frontend/addMangerPage/addManger'; // Import the AddManager component
import ManagerActions from './frontend/managerActions/managerActions';
import UpdateManagerPage from './frontend/updateManager/updateManager';
import DeleteManagerPage from './frontend/deleteManager/deleteManager';
import GetManagerInfoPage from './frontend/getManagerInfoPage/getManagerInfoPage';
import DashboardPage from './frontend/dashBoardManagers/dashBoardManagers';
import EmployeeDashboardPage from './frontend/dashboardEmployee/dashboardEmployee';
import EmployeeHierarchyPage from './frontend/employeeHierarchyPage/employeeHierarchyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/add-manager" element={<AddManager />} />
        <Route path="/manager-actions" element={<ManagerActions />} />
        <Route path="/update-manager" element={<UpdateManagerPage />} />
        <Route path="/delete-manager" element={<DeleteManagerPage />} />
        <Route path="/show-manager" element={<GetManagerInfoPage />} />
        <Route path="/dashboard-managers" element={<DashboardPage />} />
        <Route path="/dashboard-employees" element={<EmployeeDashboardPage />} />
        <Route path="/hierarchy-page" element={<EmployeeHierarchyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
 