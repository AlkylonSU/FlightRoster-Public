import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFlight } from '../context/FlightContext';
import { Button, Box, Typography, Container, CssBaseline, CircularProgress, MenuItem, FormControl, InputLabel, Select, AppBar, Toolbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FlightIcon from '@mui/icons-material/Flight';
import PublicIcon from '@mui/icons-material/Public';
import TableViewIcon from '@mui/icons-material/TableView';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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

const SelectFlight = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const navigate = useNavigate();
  const { setSelectedFlight: setGlobalSelectedFlight } = useFlight();
  const { flightNumber } = useParams();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/flightinfo/all-flights/');
        const data = await response.json();
        setFlights(data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, []);

  const handleSelection = (e) => {
    setSelectedFlight(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFlight) return;

    try {
      const selectedFlightData = flights.find(flight => flight.flight_number === selectedFlight);
      const response = await fetch(`http://localhost:8080/backend/fetch-and-assign-crew/${selectedFlight}`, {
        method: 'GET',
      });
      const data = await response.json();
      setGlobalSelectedFlight(selectedFlightData);
      navigate(`/home/${selectedFlight}`);
    } catch (error) {
      console.error('Error assigning crew:', error);
    }
  };

  const handleCreateFlight = () => {
    navigate('/create-flight');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flight Management Dashboard
          </Typography>
          {/* <Button color="inherit" onClick={() => navigate('/home/ABC123')}>Home</Button> */}
          {/* <Button color="inherit" onClick={() => navigate('/about')}>About</Button> */}
          {/* <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button> */}
          {/* <Button color="inherit" onClick={() => navigate('/select-flight')}>Select-flight</Button> */}
          <Button color="inherit" onClick={() => navigate('/')}>Sign out</Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f0f4ff 0%, #d0e2ff 100%)',
          padding: 6,
        }}
      >
        <Container component="main" maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'white',
              padding: 6,
              borderRadius: 2,
              boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '100%',
              // minHeight: '50vh', 
            }}
          >
            <Typography component="h1" variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'textSecondary' }}>
              Select Flight
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
              <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
                <InputLabel id="flight-select-label">Choose a flight</InputLabel>
                <Select
                  labelId="flight-select-label"
                  id="flights"
                  value={selectedFlight}
                  onChange={handleSelection}
                  required
                  label="Choose a flight"
                >
                  <MenuItem value="" disabled>
                    Select a flight
                  </MenuItem>
                  {flights.map((flight) => (
                    <MenuItem key={flight.flight_number} value={flight.flight_number}>
                      {flight.flight_number} - {flight.source_city} to {flight.destination_city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  padding: '16px 0',
                  borderRadius: '20px',
                  fontSize: '1.2rem',
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  transition: 'all 0.3s ease',
                }}
              >
                Confirm
              </Button>
            </Box>
            <Button
              type="button"
              onClick={handleCreateFlight}
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                padding: '16px 0',
                borderRadius: '20px',
                fontSize: '1.2rem',
                bgcolor: 'secondary.main',
                color: 'white',
                '&:hover': { bgcolor: 'secondary.dark' },
                transition: 'all 0.3s ease',
              }}
            >
              Create New Flight
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SelectFlight;
