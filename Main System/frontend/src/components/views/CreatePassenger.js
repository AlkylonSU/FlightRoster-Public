import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, CssBaseline, Box, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';

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

const CreatePassenger = () => {
  const navigate = useNavigate();
  const { flightNumber } = useParams(); // Get flight number from URL parameters

  const [formData, setFormData] = useState({
    flight_id: flightNumber || '',
    passenger_name: '',
    age: '',
    gender: '',
    nationality: '',
    seat_type: '',
    seat_number: '',
    children: []
  });

  const [childData, setChildData] = useState({
    child_name: '',
    age: '',
    gender: '',
    nationality: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.flight_id) errors.flight_id = "Flight ID is required";
    if (!formData.passenger_name) errors.passenger_name = "Passenger name is required";
    if (!formData.age) errors.age = "Age is required";
    if (!formData.gender) errors.gender = "Gender is required";
    if (!formData.nationality) errors.nationality = "Nationality is required";
    if (!formData.seat_type) errors.seat_type = "Seat type is required";
    if (!formData.seat_number) errors.seat_number = "Seat number is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChildChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const addChild = () => {
    setFormData({
      ...formData,
      children: [...formData.children, childData]
    });
    setChildData({
      child_name: '',
      age: '',
      gender: '',
      nationality: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios.post('http://127.0.0.1:8000/api/passengerinfo/create/', formData)
      .then(response => {
        console.log(response.data);
        navigate(`/home/${formData.flight_id}`);
      })
      .catch(error => {
        console.error(error);
        // Handle error - show an error message
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
    addChildButton: {
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1.2em',
      transition: 'background-color 0.3s',
      marginTop: '10px',
      width: '40%',
    },
    buttonHover: {
      backgroundColor: '#145ca8',
    },
    formGroup: {
      marginBottom: '20px',
    },
    sectionHeader: {
      color: '#1976d2',
      fontSize: '1.5em',
      marginTop: '30px',
      marginBottom: '10px',
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
          <Button color="inherit" onClick={() => navigate(`/home/${flightNumber}`)}>Home</Button>
          <Button color="inherit" onClick={() => navigate('/select-flight')}>Select-flight</Button>
          <Button color="inherit" onClick={() => navigate('/')}>Sign out</Button>
        </Toolbar>
      </AppBar>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.header}>Create Passenger</h2>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="flight_id">Flight ID:</label>
            <input id="flight_id" type="text" name="flight_id" value={formData.flight_id} onChange={handleChange} required style={styles.input} />
            {errors.flight_id && <div style={styles.error}>{errors.flight_id}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="passenger_name">Passenger Name:</label>
            <input id="passenger_name" type="text" name="passenger_name" value={formData.passenger_name} onChange={handleChange} required style={styles.input} />
            {errors.passenger_name && <div style={styles.error}>{errors.passenger_name}</div>}
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
            <label style={styles.label} htmlFor="seat_type">Seat Type:</label>
            <input id="seat_type" type="text" name="seat_type" value={formData.seat_type} onChange={handleChange} required style={styles.input} />
            {errors.seat_type && <div style={styles.error}>{errors.seat_type}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="seat_number">Seat Number:</label>
            <input id="seat_number" type="text" name="seat_number" value={formData.seat_number} onChange={handleChange} required style={styles.input} />
            {errors.seat_number && <div style={styles.error}>{errors.seat_number}</div>}
          </div>

          <h3 style={styles.sectionHeader}>Add Child</h3>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="child_name">Child Name:</label>
            <input id="child_name" type="text" name="child_name" value={childData.child_name} onChange={handleChildChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="child_age">Age:</label>
            <input id="child_age" type="number" name="age" value={childData.age} onChange={handleChildChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="child_gender">Gender:</label>
            <input id="child_gender" type="text" name="gender" value={childData.gender} onChange={handleChildChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="child_nationality">Nationality:</label>
            <input id="child_nationality" type="text" name="nationality" value={childData.nationality} onChange={handleChildChange} style={styles.input} />
          </div>
          
          <button
            type="button"
            onClick={addChild}
            style={styles.addChildButton}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.addChildButton.backgroundColor)}
          >
            Add Child
          </button>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Create Passenger
          </button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default CreatePassenger;
