import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateFlight = () => {
  const [formData, setFormData] = useState({
    flight_number: '',
    flight_date: '',
    flight_duration: '',
    flight_distance: '',
    source_country: '',
    source_city: '',
    source_airport_name: '',
    source_airport_code: '',
    destination_country: '',
    destination_city: '',
    destination_airport_name: '',
    destination_airport_code: '',
    vehicle_type: 'Boeing 737',
    shared_flight: false
  });

  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const vehicleConstants = {
    number_of_seats: 68,
    seating_plan: '2-2',
    crew_limit: 14,
    passenger_limit: 68
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/flightinfo/locations/')
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the locations!', error);
      });
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.flight_number) errors.flight_number = "Flight number is required";
    if (!formData.flight_date) errors.flight_date = "Flight date is required";
    if (!formData.flight_duration) errors.flight_duration = "Flight duration is required";
    if (!formData.flight_distance) errors.flight_distance = "Flight distance is required";
    if (!formData.source_country) errors.source_country = "Source country is required";
    if (!formData.source_city) errors.source_city = "Source city is required";
    if (!formData.source_airport_name) errors.source_airport_name = "Source airport name is required";
    if (!formData.source_airport_code) errors.source_airport_code = "Source airport code is required";
    if (!formData.destination_country) errors.destination_country = "Destination country is required";
    if (!formData.destination_city) errors.destination_city = "Destination city is required";
    if (!formData.destination_airport_name) errors.destination_airport_name = "Destination airport name is required";
    if (!formData.destination_airport_code) errors.destination_airport_code = "Destination airport code is required";
    if (!formData.vehicle_type) errors.vehicle_type = "Vehicle type is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, shared_flight: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSubmit = {
      ...formData,
      vehicle_type: {
        vehicle_type: formData.vehicle_type,
        number_of_seats: vehicleConstants.number_of_seats,
        seating_plan: vehicleConstants.seating_plan,
        crew_limit: vehicleConstants.crew_limit,
        passenger_limit: vehicleConstants.passenger_limit
      }
    };

    axios.post('http://127.0.0.1:8000/api/flightinfo/create/', dataToSubmit)
      .then(response => {
        console.log(response.data);
        navigate('/select-flight');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const getCitiesByCountry = (country) => {
    return [...new Set(locations.filter(location => location.country === country).map(location => location.city))];
  };

  const getAirportsByCity = (city) => {
    return locations.filter(location => location.city === city);
  };

  const getUniqueCountries = () => {
    const countries = locations.map(location => location.country);
    return [...new Set(countries)];
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#e3f2fd',
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
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    checkboxLabel: {
      marginLeft: '10px',
      fontSize: '1em',
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
      marginTop: '20px',
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
    tooltip: {
      marginLeft: '10px',
      color: '#1976d2',
      cursor: 'pointer',
      fontSize: '1em',
    },
    select: {
      width: '100%',
      padding: '15px',
      marginBottom: '20px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      fontSize: '1em',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Create Flight</h2>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="flight_number">Flight Number:</label>
          <input id="flight_number" type="text" name="flight_number" value={formData.flight_number} onChange={handleChange} required style={styles.input} />
          {errors.flight_number && <div style={styles.error}>{errors.flight_number}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="flight_date">Flight Date:</label>
          <input id="flight_date" type="datetime-local" name="flight_date" value={formData.flight_date} onChange={handleChange} required style={styles.input} />
          {errors.flight_date && <div style={styles.error}>{errors.flight_date}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="flight_duration">Flight Duration (HH:MM):</label>
          <input id="flight_duration" type="text" name="flight_duration" value={formData.flight_duration} onChange={handleChange} required style={styles.input} />
          {errors.flight_duration && <div style={styles.error}>{errors.flight_duration}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="flight_distance">Flight Distance:</label>
          <input id="flight_distance" type="number" name="flight_distance" value={formData.flight_distance} onChange={handleChange} required style={styles.input} />
          {errors.flight_distance && <div style={styles.error}>{errors.flight_distance}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="source_country">Source Country:</label>
          <select id="source_country" name="source_country" value={formData.source_country} onChange={handleChange} required style={styles.select}>
            <option value="">Select Country</option>
            {getUniqueCountries().map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
          {errors.source_country && <div style={styles.error}>{errors.source_country}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="source_city">Source City:</label>
          <select id="source_city" name="source_city" value={formData.source_city} onChange={handleChange} required style={styles.select}>
            <option value="">Select City</option>
            {getCitiesByCountry(formData.source_country).map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          {errors.source_city && <div style={styles.error}>{errors.source_city}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="source_airport_name">Source Airport Name:</label>
          <select id="source_airport_name" name="source_airport_name" value={formData.source_airport_name} onChange={handleChange} required style={styles.select}>
            <option value="">Select Airport</option>
            {getAirportsByCity(formData.source_city).map((airport, index) => (
              <option key={index} value={airport.airport_name}>{airport.airport_name}</option>
            ))}
          </select>
          {errors.source_airport_name && <div style={styles.error}>{errors.source_airport_name}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="source_airport_code">Source Airport Code:</label>
          <select id="source_airport_code" name="source_airport_code" value={formData.source_airport_code} onChange={handleChange} required style={styles.select}>
            <option value="">Select Code</option>
            {getAirportsByCity(formData.source_city).map((airport, index) => (
              <option key={index} value={airport.airport_code}>{airport.airport_code}</option>
            ))}
          </select>
          {errors.source_airport_code && <div style={styles.error}>{errors.source_airport_code}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="destination_country">Destination Country:</label>
          <select id="destination_country" name="destination_country" value={formData.destination_country} onChange={handleChange} required style={styles.select}>
            <option value="">Select Country</option>
            {getUniqueCountries().map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
          {errors.destination_country && <div style={styles.error}>{errors.destination_country}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="destination_city">Destination City:</label>
          <select id="destination_city" name="destination_city" value={formData.destination_city} onChange={handleChange} required style={styles.select}>
            <option value="">Select City</option>
            {getCitiesByCountry(formData.destination_country).map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
          {errors.destination_city && <div style={styles.error}>{errors.destination_city}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="destination_airport_name">Destination Airport Name:</label>
          <select id="destination_airport_name" name="destination_airport_name" value={formData.destination_airport_name} onChange={handleChange} required style={styles.select}>
            <option value="">Select Airport</option>
            {getAirportsByCity(formData.destination_city).map((airport, index) => (
              <option key={index} value={airport.airport_name}>{airport.airport_name}</option>
            ))}
          </select>
          {errors.destination_airport_name && <div style={styles.error}>{errors.destination_airport_name}</div>}
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="destination_airport_code">Destination Airport Code:</label>
          <select id="destination_airport_code" name="destination_airport_code" value={formData.destination_airport_code} onChange={handleChange} required style={styles.select}>
            <option value="">Select Code</option>
            {getAirportsByCity(formData.destination_city).map((airport, index) => (
              <option key={index} value={airport.airport_code}>{airport.airport_code}</option>
            ))}
          </select>
          {errors.destination_airport_code && <div style={styles.error}>{errors.destination_airport_code}</div>}
        </div>

        <h3 style={styles.sectionHeader}>Vehicle</h3>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="vehicle_type">Vehicle Type:</label>
          <select id="vehicle_type" name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required style={styles.select}>
            <option value="Boeing 737">Boeing 737</option>
            <option value="Airbus A320">Airbus A320</option>
            <option value="Embraer E190">Embraer E190</option>
          </select>
          {errors.vehicle_type && <div style={styles.error}>{errors.vehicle_type}</div>}
        </div>

        <div style={styles.checkboxContainer}>
          <input type="checkbox" name="shared_flight" checked={formData.shared_flight} onChange={handleCheckboxChange} />
          <label style={styles.checkboxLabel}>Shared Flight</label>
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Create Flight
        </button>
      </form>
    </div>
  );
};

export default CreateFlight;
