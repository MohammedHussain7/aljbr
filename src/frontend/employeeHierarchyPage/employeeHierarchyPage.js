import React, { useState, useEffect } from 'react';
import './hierarchy.css';

// Helper function to find the parent of an employee
const findParent = (data, itemName) => {
  let parent = null;
  for (const item of data) {
    if (item.children) {
      const child = item.children.find((child) => child.name === itemName);
      if (child) {
        parent = item;
        break;
      }
      parent = findParent(item.children, itemName); // Recursively search in children
    }
  }
  return parent;
};
const findParentPath = (data, itemName, path = []) => {
  for (const item of data) {
    if (item.name === itemName) {
      return [...path, item]; // Add current item to the path
    }

    if (item.children) {
      const result = findParentPath(item.children, itemName, [...path, item]);
      if (result) return result;
    }
  }
  return null; // Return null if not found
};

// HierarchyTree component to recursively display the hierarchy as a tree
const HierarchyTree = ({ data, searchQuery, highlightedItems, onItemClick }) => {
  return (
    <div className="flex justify-center items-center">
      {data.map((item, index) => {
        const isHighlighted = searchQuery && highlightedItems[item.name];

        return (
          <div key={index} className="flex flex-col items-center mx-6">
            {/* Manager or Employee Circle */}
            <div
              className={`w-20 h-20 flex items-center justify-center rounded-full border p-4 mb-4 transition-all cursor-pointer 
                          ${isHighlighted ? 'bg-[#a1a1a1]' : item.role === 'manager' ? 'bg-[#1a202c]' : 'bg-[#4a5568]'}`}
              onClick={() => onItemClick(item.name)} // Trigger onItemClick to show parent in popup
            >
              <div className="text-center text-white font-bold">{item.name.split(' ')[0]}</div>
            </div>

            <div className="text-center text-white">{item.name} ({item.role})</div>

            {/* Always render children */}
            {item.children && item.children.length > 0 && (
              <div className="flex justify-center mt-4">
                <HierarchyTree
                  data={item.children}
                  searchQuery={searchQuery}
                  highlightedItems={highlightedItems}
                  onItemClick={onItemClick}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const HierarchyChartPage = () => {
  const [hierarchyData, setHierarchyData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedItems, setHighlightedItems] = useState({});
  const [popupData, setPopupData] = useState(null); // State for storing popup data

  useEffect(() => {
    // Fetch the hierarchy data from your API
    const fetchHierarchy = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/hierarchy'); // Adjust API URL if necessary
        const data = await response.json();
        setHierarchyData(data);
      } catch (error) {
        console.error('Error fetching hierarchy data:', error);
      }
    };

    fetchHierarchy();
  }, []);

  // Function to highlight an item and its parent/children based on the search query
  const highlightItems = (query) => {
    const highlighted = {};
    if (!query) return highlighted; // If no query, don't highlight anything

    // Function to highlight the parent and children of a matched item
    const highlightHierarchy = (data, itemName) => {
      for (const item of data) {
        if (item.name.toLowerCase().includes(itemName.toLowerCase())) {
          highlighted[item.name] = true;

          // Highlight the parent if this is an employee
          if (item.role === 'employee' && item.managerId) {
            let parent = findParent(data, item.name);
            while (parent) {
              highlighted[parent.name] = true;
              parent = findParent(data, parent.name); // Continue highlighting upwards
            }
          }
        }
        if (item.children) highlightHierarchy(item.children, itemName); // Recursive call to search in children
      }
    };

    highlightHierarchy(hierarchyData, query);
    return highlighted;
  };

  // Whenever the search query changes, update highlighted items
  useEffect(() => {
    const highlighted = highlightItems(searchQuery);
    setHighlightedItems(highlighted);
  }, [searchQuery]);

  // Show a popup with the parent(s) of the clicked item
  const showParentPopup = (itemName) => {
    const pathToRoot = findParentPath(hierarchyData, itemName);
    if (pathToRoot) {
      setPopupData(pathToRoot);
    }
  };
  // Close the popup
  const closePopup = () => {
    setPopupData(null);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Employee Hierarchy</h1>

      {/* Search input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for employee or manager..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Display the hierarchy */}
      {hierarchyData.length > 0 ? (
        <HierarchyTree
          data={hierarchyData}
          searchQuery={searchQuery}
          highlightedItems={highlightedItems}
          onItemClick={showParentPopup} // Pass the showParentPopup function to handle clicks
        />
      ) : (
        <p>Loading hierarchy...</p>
      )}

      {/* Popup for showing parent */}
 {/* Popup for showing the path to the root */}
{popupData && (
  <div className="popup">
    <div className="popup-content">
      <h2>Hierarchy Path</h2>
      <ul>
        {popupData.map((item, index) => (
          <li key={index}>
            {item.name} ({item.role})
          </li>
        ))}
      </ul>
      <button onClick={closePopup}>Close</button>
    </div>
  </div>
)}

    </div>
  );
};

export default HierarchyChartPage;
