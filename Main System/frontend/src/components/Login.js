import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography, Container, CssBaseline, CircularProgress, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AccountCircle, Lock } from '@mui/icons-material';

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

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/backend/login/', {
                username: username,
                password: password
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            window.location.href = '/select-flight'; // Change '/dashboard' to your desired route
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(180deg, #f0f4ff 0%, #d0e2ff 100%)',
                    padding: 6,
                    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                }}
            >
                <Container component="main" maxWidth="md">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'white',
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            minHeight: '50vh', 

                        }}
                    >
                        <Typography component="h1" variant="h4" sx={{ fontSize: '2rem', fontWeight: 'bold', color: 'textSecondary' }}>
                            Log in to your account
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 3, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                aria-label="Username"
                                InputLabelProps={{ style: { fontSize: '1.2rem' } }}
                                inputProps={{ style: { fontSize: '1.2rem', padding: '14px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                aria-label="Password"
                                InputLabelProps={{ style: { fontSize: '1.2rem' } }}
                                inputProps={{ style: { fontSize: '1.2rem', padding: '14px' } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 4, 
                                    mb: 2, 
                                    padding: '16px 0', 
                                    borderRadius: '20px', 
                                    fontSize: '1.2rem',
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    transition: 'all 0.3s ease',
                                }}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Log in'}
                            </Button>
                            {error && (
                                <Typography variant="body2" color="error" align="center" sx={{ fontSize: '1rem' }}>
                                    {error}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default Login;