import React, { createContext, useState, useContext } from 'react';

const FlightContext = createContext();

export const useFlight = () => {
  return useContext(FlightContext);
};

export const FlightProvider = ({ children }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <FlightContext.Provider value={{ selectedFlight, setSelectedFlight }}>
      {children}
    </FlightContext.Provider>
  );
};
