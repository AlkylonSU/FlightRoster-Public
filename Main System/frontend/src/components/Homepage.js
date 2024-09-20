import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import FlightIcon from '@mui/icons-material/Flight';
import PublicIcon from '@mui/icons-material/Public';
import TableViewIcon from '@mui/icons-material/TableView';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd'; // New icon for crew
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const Homepage = () => {
  const navigate = useNavigate();
  const { flightNumber } = useParams();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flight Management Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/home/ABC123')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/select-flight')}>Select-flight</Button>
          <Button color="inherit" onClick={() => navigate('/')}>Sign out</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ height: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f0f4ff 0%, #d0e2ff 100%)',
            padding: 5,
            borderRadius: 2,
            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" color="textSecondary" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your Flight Management Dashboard
          </Typography>
          <Box sx={{ mt: 3, width: '100%' }}>
            <Button
              startIcon={<TableViewIcon />}
              variant="contained"
              sx={{ 
                width: '100%', 
                mb: 1.5, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 1.5,
                fontSize: '1.1rem',
              }}
              onClick={() => navigate(`/tabular-view/${flightNumber}`)}
            >
              Tabular View
            </Button>
            <Button
              startIcon={<FlightIcon />}
              variant="contained"
              sx={{ 
                width: '100%', 
                mb: 1.5, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 1.5,
                fontSize: '1.1rem',
              }}
              onClick={() => navigate(`/plane-view/${flightNumber}`)}
            >
              Plane View
            </Button>
            <Button
              startIcon={<PublicIcon />}
              variant="contained"
              sx={{ 
                width: '100%', 
                mb: 1.5, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 1.5,
                fontSize: '1.1rem',
              }}
              onClick={() => navigate(`/extended-view/${flightNumber}`)}
            >
              Extended View
            </Button>
            <Button
              startIcon={<AssignmentIcon />}
              variant="contained"
              sx={{ 
                width: '100%', 
                mb: 1.5, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 1.5,
                fontSize: '1.1rem',
              }}
              onClick={() => navigate(`/roster-management/${flightNumber}`)}
            >
              Roster Management
            </Button>
            <Button
              startIcon={<PersonAddIcon />}
              variant="contained"
              sx={{ 
                width: '100%', 
                mb: 1.5, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 1.5,
                fontSize: '1.1rem',
              }}
              onClick={() => navigate(`/create-passenger/${flightNumber}`)}
            >
              Create Passenger
            </Button>
            <Button
              startIcon={<GroupAddIcon />}
              variant="contained"
              sx={{ 
                width: '100%', 
                mb: 1.5, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 1.5,
                fontSize: '1.1rem',
              }}
              onClick={() => navigate(`/create-flight-crew/`)}
            >
              Create Flight Crew
            </Button>
            <Button
              startIcon={<GroupAddIcon />}
              variant="contained"
              sx={{ 
                width: '100%', 
                mb: 1.5, 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 1.5,
                fontSize: '1.1rem',
              }}
              onClick={() => navigate(`/create-cabin-crew/`)}
            >
              Create Cabin Crew
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Homepage;
