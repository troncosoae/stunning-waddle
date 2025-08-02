import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StarAssignmentView from './views/StarAssignmentView';
import TeamStarReportView from './views/TeamStarReportView';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for View 1: Star Assignment */}
          <Route path="/star-assignment" element={<StarAssignmentView />} />
          
          {/* Route for View 2: Ball Collection Report */}
          <Route path="/team-star-report/" element={<TeamStarReportView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;