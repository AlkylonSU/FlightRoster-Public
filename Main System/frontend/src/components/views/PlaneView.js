import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './PlaneView.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#6C757D',
    },
    info: {
      main: '#17A2B8',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});


const seatsLayout = [
  // Business class
  { id: '1A', type: 'business', row: 2, col: 1 },
  { id: '1B', type: 'business', row: 2, col: 2 },
  { id: '1E', type: 'business', row: 2, col: 5 },
  { id: '1F', type: 'business', row: 2, col: 6 },

  { id: '2A', type: 'business', row: 3, col: 1 },
  { id: '2B', type: 'business', row: 3, col: 2 },
  { id: '2E', type: 'business', row: 3, col: 5 },
  { id: '2F', type: 'business', row: 3, col: 6 },

  { id: '3A', type: 'business', row: 4, col: 1 },
  { id: '3B', type: 'business', row: 4, col: 2 },
  { id: '3E', type: 'business', row: 4, col: 5 },
  { id: '3F', type: 'business', row: 4, col: 6 },

  { id: '4A', type: 'business', row: 5, col: 1 },
  { id: '4B', type: 'business', row: 5, col: 2 },
  { id: '4E', type: 'business', row: 5, col: 5 },
  { id: '4F', type: 'business', row: 5, col: 6 },

  // Leave a row empty before starting economy class
  // Economy class
  { id: '5A', type: 'economy', row: 7, col: 1 },
  { id: '5B', type: 'economy', row: 7, col: 2 },
  { id: '5E', type: 'economy', row: 7, col: 5 },
  { id: '5F', type: 'economy', row: 7, col: 6 },

  { id: '6A', type: 'economy', row: 8, col: 1 },
  { id: '6B', type: 'economy', row: 8, col: 2 },
  { id: '6E', type: 'economy', row: 8, col: 5 },
  { id: '6F', type: 'economy', row: 8, col: 6 },

  { id: '7A', type: 'economy', row: 9, col: 1 },
  { id: '7B', type: 'economy', row: 9, col: 2 },
  { id: '7E', type: 'economy', row: 9, col: 5 },
  { id: '7F', type: 'economy', row: 9, col: 6 },

  { id: '8A', type: 'economy', row: 10, col: 1 },
  { id: '8B', type: 'economy', row: 10, col: 2 },
  { id: '8E', type: 'economy', row: 10, col: 5 },
  { id: '8F', type: 'economy', row: 10, col: 6 },

  { id: '9A', type: 'economy', row: 11, col: 1 },
  { id: '9B', type: 'economy', row: 11, col: 2 },
  { id: '9E', type: 'economy', row: 11, col: 5 },
  { id: '9F', type: 'economy', row: 11, col: 6 },

  { id: '10A', type: 'economy', row: 12, col: 1 },
  { id: '10B', type: 'economy', row: 12, col: 2 },
  { id: '10E', type: 'economy', row: 12, col: 5 },
  { id: '10F', type: 'economy', row: 12, col: 6 },

  { id: '11A', type: 'economy', row: 13, col: 1 },
  { id: '11B', type: 'economy', row: 13, col: 2 },
  { id: '11E', type: 'economy', row: 13, col: 5 },
  { id: '11F', type: 'economy', row: 13, col: 6 },

  { id: '12A', type: 'economy', row: 14, col: 1 },
  { id: '12B', type: 'economy', row: 14, col: 2 },
  { id: '12E', type: 'economy', row: 14, col: 5 },
  { id: '12F', type: 'economy', row: 14, col: 6 },

  { id: '13A', type: 'economy', row: 15, col: 1 },
  { id: '13B', type: 'economy', row: 15, col: 2 },
  { id: '13E', type: 'economy', row: 15, col: 5 },
  { id: '13F', type: 'economy', row: 15, col: 6 },

  { id: '14A', type: 'economy', row: 16, col: 1 },
  { id: '14B', type: 'economy', row: 16, col: 2 },
  { id: '14E', type: 'economy', row: 16, col: 5 },
  { id: '14F', type: 'economy', row: 16, col: 6 },

  { id: '15A', type: 'economy', row: 17, col: 1 },
  { id: '15B', type: 'economy', row: 17, col: 2 },
  { id: '15E', type: 'economy', row: 17, col: 5 },
  { id: '15F', type: 'economy', row: 17, col: 6 },

  { id: '16A', type: 'economy', row: 18, col: 1 },
  { id: '16B', type: 'economy', row: 18, col: 2 },
  { id: '16E', type: 'economy', row: 18, col: 5 },
  { id: '16F', type: 'economy', row: 18, col: 6 },

  { id: '17A', type: 'economy', row: 19, col: 1 },
  { id: '17B', type: 'economy', row: 19, col: 2 },
  { id: '17E', type: 'economy', row: 19, col: 5 },
  { id: '17F', type: 'economy', row: 19, col: 6 },
];


const PlaneView = () => {
  const { flightNumber } = useParams();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([]);
  const [hoveredPassenger, setHoveredPassenger] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [hoverVisible, setHoverVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/passengerinfo/flight/${flightNumber}/`);
        const data = await response.json();
        setPassengers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching passenger data:', error);
        setLoading(false);
      }
    };

    fetchPassengers();
  }, [flightNumber]);

  const handleMouseEnter = (passenger, event) => {
    const rect = event.target.getBoundingClientRect();
    setHoverPosition({
      top: rect.top + window.scrollY - 100,
      left: rect.left + window.scrollX,
    });
    setHoveredPassenger(passenger);
    setHoverVisible(true);
  };

  const handleMouseLeave = () => {
    setHoverVisible(false);
  };

  const handleSeatClick = (passenger) => {
    alert(`Passenger Details:\n\nName: ${passenger.passenger_name}\nAge: ${passenger.age}\nGender: ${passenger.gender}\nNationality: ${passenger.nationality}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flight Management Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/home/ABC123')}>Home</Button>
          {/* <Button color="inherit" onClick={() => navigate('/about')}>About</Button>
          <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button> */}
                    <Button color="inherit" onClick={() => navigate('/select-flight')}>Select-flight</Button>
          <Button color="inherit" onClick={() => navigate('/')}>Sign out</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ padding: 4 }}>
        <Box
          sx={{
            background: 'linear-gradient(180deg, #f0f4ff 0%, #d0e2ff 100%)',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h4" color="textSecondary" gutterBottom>
            Plane View - Seat Map
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress size={50} color="primary" />
              <Typography variant="h6" color="textSecondary" sx={{ ml: 2 }}>Loading data, please wait...</Typography>
            </Box>
          ) : (
            <div className="plane-container">
              <header className="header">
                <Typography variant="h5">Flight {flightNumber}</Typography>
                <Typography variant="subtitle1">Seat Map</Typography>
              </header>
              <div className="plane">
                <div className="banner business-class-banner">BUSINESS</div>
                <div className="banner economy-class-banner">ECONOMY</div>
                {seatsLayout.map((seat) => {
                  const passenger = passengers.find((p) => p.seat_number === seat.id);
                  return (
                    <div
                      key={seat.id}
                      className={`seat ${seat.type}`}
                      onMouseEnter={(event) => passenger && handleMouseEnter(passenger, event)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => passenger && handleSeatClick(passenger)}
                      style={{
                        gridRow: seat.row,
                        gridColumn: seat.col,
                      }}
                    >
                      <span>{seat.id}</span>
                    </div>
                  );
                })}
                <div className="aisle" style={{ gridColumn: '3 / span 2', gridRow: '1 / -1' }}></div>
                <div className="exit-row" style={{ gridColumn: '1 / -1', gridRow: '7' }}></div>
                <div className="exit-row" style={{ gridColumn: '1 / -1', gridRow: '12' }}></div>
              </div>
              {hoverVisible && hoveredPassenger && (
                <div className="hover-info" style={{ top: hoverPosition.top, left: hoverPosition.left }}>
                  <Typography variant="body1"><strong>Name:</strong> {hoveredPassenger.passenger_name}</Typography>
                  <Typography variant="body1"><strong>Age:</strong> {hoveredPassenger.age}</Typography>
                  <Typography variant="body1"><strong>Seat:</strong> {hoveredPassenger.seat_number}</Typography>
                  <Typography variant="body1"><strong>Children:</strong></Typography>
                  {hoveredPassenger.children && hoveredPassenger.children.length > 0 ? (
                    hoveredPassenger.children.map((child) => (
                      <div key={child.child_id}>
                        <Typography variant="body2"><strong>  - Name:</strong> {child.child_name}</Typography>
                        <Typography variant="body2"><strong>  - Age:</strong> {child.age}</Typography>
                        <Typography variant="body2"><strong>  - Gender:</strong> {child.gender}</Typography>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2">None</Typography>
                  )}
                </div>
              )}
            </div>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PlaneView;

