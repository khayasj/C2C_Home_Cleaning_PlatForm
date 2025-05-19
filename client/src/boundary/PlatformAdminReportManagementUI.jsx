import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomTable from '../components/CustomTable';

import './PlatformAdminReportManagementUI.css';

function PlatformAdminReportManagementUI() {

  const [selectedRange, setSelectedRange] = useState('day');
  const [reportData, setReportData] = useState([]);

  //add state for user details modal, view user details
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const fetchReport = async (range) => {
    let endpoint = '';
    if (range === 'day') endpoint = '/api/servicecategory/dailyreport';
    else if (range === 'week') endpoint = '/api/servicecategory/weeklyreport';
    else if (range === 'month') endpoint = '/api/servicecategory/monthlyreport';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`);
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
    }
  };

  useEffect(() => {
    fetchReport(selectedRange);
  }, [selectedRange]);

  const handleChange = (e) => {
    setSelectedRange(e.target.value);
  };

  const openDetailsModal = (category) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
      <h2>Service Category Report</h2>
      
        <select value={selectedRange} onChange={handleChange} style={{ marginBottom: '1rem' }}>
          <option value="day">Past Day</option>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
        </select>

          <CustomTable
            columns={[
              { id: 'servicecategory', label: 'Service Category' },
              { id: 'total', label: 'Number of Matches' }
            ]}
            data={reportData}
            onEdit={openDetailsModal}
          />

          {/* User Details Modal */}
          {showDetailsModal && selectedCategory && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Service Category Details</h3>
                  <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
                </div>
                <div className="form-group"><strong>Service Category:</strong> {selectedCategory.servicecategory}</div>
                <div className="form-group"><strong>Description:</strong> {selectedCategory.servicedescription}</div>
                <div className="modal-footer">
                  <button className="btn btn-cancel" onClick={() => setSelectedCategory(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default PlatformAdminReportManagementUI;
