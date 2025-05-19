// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginUI from './boundary/LoginUI';
import HomeownerManagementUI from './boundary/HomeownerManagementUI';
import HomeownerShortlistManagementUI from './boundary/HomeownerShortlistManagementUI';
import HomeownerHistoryManagementUI from './boundary/HomeownerHistoryManagementUI';
import CleanerServiceManagementUI from './boundary/CleanerServiceManagementUI';
import CleanerHistoryManagementUI from './boundary/CleanerHistoryManagementUI';
import PlatformAdminManagementUI from './boundary/PlatformAdminManagementUI';
import UAUserAccountManagementUI from './boundary/UAUserAccountManagementUI';
import UAUserProfileManagementUI from './boundary/UAUserProfileManagementUI';
import PlatformAdminReportManagementUI from './boundary/PlatformAdminReportManagementUI';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginUI />} />
        <Route path="/accountmanagement" element={<UAUserAccountManagementUI />} />
        <Route path="/profilemanagement" element={<UAUserProfileManagementUI />} />
        <Route path="/cleaner" element={<CleanerServiceManagementUI />} />
        <Route path="/cleanerhistory" element={<CleanerHistoryManagementUI />} />
        <Route path="/homeowner" element={<HomeownerManagementUI />} />
        <Route path="/homeownershortlist" element={<HomeownerShortlistManagementUI />} />
        <Route path="/homeownerhistory" element={<HomeownerHistoryManagementUI />} />
        <Route path="/platformadmin" element={<PlatformAdminManagementUI />} />
        <Route path="/platformadminreport" element={<PlatformAdminReportManagementUI />} />
      </Routes>
    </Router>
  );
}

export default App;
