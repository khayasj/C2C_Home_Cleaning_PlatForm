import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CustomTable.css';
import './CustomTableHomeowner.css';
import editIcon from '../assets/edit.svg';
import viewIcon from '../assets/view.svg';
import bookmarkIcon from '../assets/bookmark.svg';
import bookmarkRedIcon from '../assets/bookmark-red.svg';

/**
 * CustomTableHomeowner - A modified table component specific for Homeowner UI with view and shortlist icons
 * @param {Object} props - Component props
 * @param {Array} props.columns - Array of column objects with keys: id, label
 * @param {Array} props.data - Array of data objects to display in table rows
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onShortlist - Function to call when shortlist button is clicked
 * @param {boolean} props.showActions - Whether to show the actions column (default: true)
 * @returns {JSX.Element} Table component
 */
const CustomTableHomeowner = ({ columns, data = [], onEdit, onShortlist, showActions = true }) => {
  // Initialize shortlistedServices state from data
  const initialShortlistState = {};
  
  // Safely handle data array
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      initialShortlistState[index] = item?.isShortlisted || false;
    });
  }

  const [shortlistedServices, setShortlistedServices] = useState(initialShortlistState);

  // Update shortlistedServices when data changes (e.g., after API call)
  React.useEffect(() => {
    if (Array.isArray(data)) {
      const newState = {};
      data.forEach((item, index) => {
        newState[index] = item?.isShortlisted || false;
      });
      setShortlistedServices(newState);
    }
  }, [data]);

  const handleShortlistClick = (item, index) => {
    setShortlistedServices(prev => {
      const newState = { 
        ...prev, 
        [index]: !prev[index] 
      };
      
      // Call parent callback if provided
      if (onShortlist) {
        onShortlist(item, newState[index]);
      }
      
      return newState;
    });
  };
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id}>{column.label}</th>
          ))}
          {showActions && <th className="actions-column">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) && data.map((item, index) => (
          <tr key={index} data-testid="service-row">
            {columns.map((column) => {
              if (column.id === 'numofviews') {
                return (
                  <td key={`${index}-${column.id}`}>
                    <div className="icon-cell">
                      <img src={viewIcon} alt="Views" className="table-icon" />
                      <span>{item[column.id]}</span>
                    </div>
                  </td>
                );
              } else if (column.id === 'numofshortlist') {
                return (
                  <td key={`${index}-${column.id}`}>
                    <div className="icon-cell">
                      <img
                        data-testid={`shortlist-icon-${index}`}  
                        src={shortlistedServices[index] ? bookmarkRedIcon : bookmarkIcon} 
                        alt="Shortlist" 
                        className="table-icon clickable"
                        onClick={() => handleShortlistClick(item, index)}
                      />
                      <span>{item[column.id]}</span>
                    </div>
                  </td>
                );
              } else {
                return <td key={`${index}-${column.id}`}>{item[column.id]}</td>;
              }
            })}
            {showActions && (
              <td className="actions-cell">
                <button onClick={() => onEdit(item)} className="icon-button">
                  <img src={editIcon} alt="Edit" className="edit-icon" />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

CustomTableHomeowner.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onShortlist: PropTypes.func,
  showActions: PropTypes.bool
};

export default CustomTableHomeowner;
