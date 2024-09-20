import React, { useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, CssBaseline, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const CreateFlightCrew = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    nationality: '',
    known_languages: '',
    vehicle_restriction: '',
    allowed_range: '',
    seniority_level: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = "Name is required";
    if (!formData.age) errors.age = "Age is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.nationality) errors.nationality = "Nationality is required";
    if (!formData.known_languages) errors.known_languages = "Known languages are required";
    if (!formData.vehicle_restriction) errors.vehicle_restriction = "Vehicle restriction is required";
    if (!formData.allowed_range) errors.allowed_range = "Allowed range is required";
    if (!formData.seniority_level) errors.seniority_level = "Seniority level is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios.post('http://127.0.0.1:8000/api/flightcrewinfo/create/', formData)
      .then(response => {
        console.log(response.data);
        navigate(`/select-flight`);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f0f4ff 0%, #d0e2ff 100%)',
      padding: '20px',
    },
    form: {
      maxWidth: '600px',
      width: '100%',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      overflowY: 'auto',
      maxHeight: '80vh',
    },
    header: {
      color: '#1976d2',
      fontSize: '2em',
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      color: '#333',
      fontWeight: 'bold',
      fontSize: '1.2em',
    },
    input: {
      width: '100%',
      padding: '15px',
      marginBottom: '20px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      fontSize: '1em',
    },
    error: {
      color: 'red',
      marginBottom: '20px',
    },
    button: {
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1.2em',
      transition: 'background-color 0.3s',
      marginTop: '10px',
      width: '80%',
    },
    buttonHover: {
      backgroundColor: '#145ca8',
    },
    formGroup: {
      marginBottom: '20px',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flight Management Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/select-flight')}>Select-flight</Button>
          <Button color="inherit" onClick={() => navigate('/')}>Sign out</Button>
        </Toolbar>
      </AppBar>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.header}>Create Flight Crew</h2>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Name:</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
            {errors.name && <div style={styles.error}>{errors.name}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="age">Age:</label>
            <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} required style={styles.input} />
            {errors.age && <div style={styles.error}>{errors.age}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="gender">Gender:</label>
            <input id="gender" type="text" name="gender" value={formData.gender} onChange={handleChange} required style={styles.input} />
            {errors.gender && <div style={styles.error}>{errors.gender}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="nationality">Nationality:</label>
            <input id="nationality" type="text" name="nationality" value={formData.nationality} onChange={handleChange} required style={styles.input} />
            {errors.nationality && <div style={styles.error}>{errors.nationality}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="known_languages">Known Languages:</label>
            <input id="known_languages" type="text" name="known_languages" value={formData.known_languages} onChange={handleChange} required style={styles.input} />
            {errors.known_languages && <div style={styles.error}>{errors.known_languages}</div>}
          </div>
          <div style={styles.formGroup}>
            <FormControl fullWidth>
              <InputLabel id="vehicle_restriction_label">Vehicle Restriction</InputLabel>
              <Select
                labelId="vehicle_restriction_label"
                id="vehicle_restriction"
                name="vehicle_restriction"
                value={formData.vehicle_restriction}
                onChange={handleChange}
                required
              >
                <MenuItem value="Boeing 737">Boeing 737</MenuItem>
                <MenuItem value="Airbus A320">Airbus A320</MenuItem>
                <MenuItem value="Embraer E190">Embraer E190</MenuItem>
              </Select>
            </FormControl>
            {errors.vehicle_restriction && <div style={styles.error}>{errors.vehicle_restriction}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="allowed_range">Allowed Range:</label>
            <input id="allowed_range" type="number" name="allowed_range" value={formData.allowed_range} onChange={handleChange} required style={styles.input} />
            {errors.allowed_range && <div style={styles.error}>{errors.allowed_range}</div>}
          </div>
          <div style={styles.formGroup}>
            <FormControl fullWidth>
              <InputLabel id="seniority_level_label">Seniority Level</InputLabel>
              <Select
                labelId="seniority_level_label"
                id="seniority_level"
                name="seniority_level"
                value={formData.seniority_level}
                onChange={handleChange}
                required
              >
                <MenuItem value="senior">Senior</MenuItem>
                <MenuItem value="junior">Junior</MenuItem>
                <MenuItem value="trainee">Trainee</MenuItem>
              </Select>
            </FormControl>
            {errors.seniority_level && <div style={styles.error}>{errors.seniority_level}</div>}
          </div>
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Create Flight Crew
          </button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default CreateFlightCrew;
