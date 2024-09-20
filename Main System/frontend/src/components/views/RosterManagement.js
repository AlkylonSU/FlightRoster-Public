
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ViewListIcon from '@mui/icons-material/ViewList';
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

const RosterManagement = () => {
  const { flightNumber } = useParams();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDownload = (url) => {
    window.location.href = url;
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
      <Container component="main" maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f0f4ff 0%, #d0e2ff 100%)',
            padding: 6,
            borderRadius: 2,
            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" color="textSecondary" gutterBottom>
            Roster Management
          </Typography>
          <Box sx={{ mt: 4, width: '100%' }}>
            <Button
              startIcon={<CreateIcon />}
              variant="contained"
              sx={{
                width: '100%',
                mb: 2,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 2,
                fontSize: '1.1rem',
              }}
              onClick={() => handleDownload(`http://localhost:8080/backend/export/mysql/${flightNumber}/`)}
            >
              Create Roster (SQL)
            </Button>
            <Button
              startIcon={<CreateIcon />}
              variant="contained"
              sx={{
                width: '100%',
                mb: 2,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 2,
                fontSize: '1.1rem',
              }}
              onClick={() => handleDownload(`http://localhost:8080/backend/export/mongodb/${flightNumber}/`)}
            >
              Create Roster (NoSQL)
            </Button>
            <Button
              startIcon={<SaveAltIcon />}
              variant="contained"
              sx={{
                width: '100%',
                mb: 2,
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                transition: 'all 0.3s ease',
                padding: 2,
                fontSize: '1.1rem',
              }}
              onClick={() => handleDownload(`http://localhost:8080/backend/export/json/${flightNumber}/`)}
            >
              Export Roster (JSON)
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default RosterManagement;
