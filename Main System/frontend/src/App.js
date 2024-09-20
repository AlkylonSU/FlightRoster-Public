import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Homepage from './components/Homepage';
import TabularView from './components/views/TabularView';
import PlaneView from './components/views/PlaneView';
import ExtendedView from './components/views/ExtendedView';
import SelectFlight from './components/SelectFlight';
import RosterManagement from './components/views/RosterManagement';
import CreatePassenger from './components/views/CreatePassenger'; // Import the new component
import CreateFlight from './components/CreateFlight'; // Import the new component
import CreateCabinCrew from './components/views/CreateCabinCrew'; // Import the CreateCabinCrew component
import CreateFlightCrew from './components/views/CreateFlightCrew'; // Import the CreateCabinCrew component


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/select-flight" element={<SelectFlight />} />
        <Route path="/home/:flightNumber" element={<Homepage />} />
        <Route path="/tabular-view/:flightNumber" element={<TabularView />} />
        <Route path="/plane-view/:flightNumber" element={<PlaneView />} />
        <Route path="/extended-view/:flightNumber" element={<ExtendedView />} />
        <Route path="/roster-management/:flightNumber" element={<RosterManagement />} />
        <Route path="/create-passenger/:flightNumber" element={<CreatePassenger />} /> {/* Add the new route */}
        <Route path="/create-flight" element={<CreateFlight />} /> {/* Add the new route */}
          <Route path="/create-cabin-crew" element={<CreateCabinCrew />} /> {/* Add the new route */}
          <Route path="/create-flight-crew" element={<CreateFlightCrew />} /> {/* Add the new route */}


      </Routes>
    </Router>
  );
}

export default App;
