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
import DashboardPage from './frontend/dashBoardManagers/dashBoardManagers';
import EmployeeDashboardPage from './frontend/dashboardEmployee/dashboardEmployee';
import HierarchyChartPage from './frontend/employeeHierarchyPage/employeeHierarchyPage';
import DepartmentDashboardPage from './frontend/dashboardDepartment/dashboardDepartment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard-managers" element={<DashboardPage />} />
        <Route path="/dashboard-department" element={<DepartmentDashboardPage />} />
        <Route path="/dashboard-employees" element={<EmployeeDashboardPage />} />
        <Route path="/hierarchy-page" element={<HierarchyChartPage />} />
      </Routes>
    </Router>
  ); 
}

export default App;
  