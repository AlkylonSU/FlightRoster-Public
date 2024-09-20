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

const CreateCabinCrew = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    nationality: '',
    known_languages: '',
    attendant_type: '',
    vehicle_restrictions: '',
    dish_recipes: [],
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
    if (!formData.attendant_type) errors.attendant_type = "Attendant type is required";
    if (!formData.vehicle_restrictions) errors.vehicle_restrictions = "Vehicle restrictions are required";
    if (formData.attendant_type === 'chef' && formData.dish_recipes.length === 0) {
      errors.dish_recipes = "At least one dish recipe is required for chefs";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecipe = () => {
    setFormData({ ...formData, dish_recipes: [...formData.dish_recipes, { recipe_name: '' }] });
  };

  const handleRecipeChange = (index, e) => {
    const updatedRecipes = formData.dish_recipes.map((recipe, i) => (
      i === index ? { ...recipe, recipe_name: e.target.value } : recipe
    ));
    setFormData({ ...formData, dish_recipes: updatedRecipes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios.post('http://127.0.0.1:8000/api/cabincrewinfo/create/', formData)
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
          <h2 style={styles.header}>Create Cabin Crew</h2>
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
              <InputLabel id="attendant_type_label">Attendant Type</InputLabel>
              <Select
                labelId="attendant_type_label"
                id="attendant_type"
                name="attendant_type"
                value={formData.attendant_type}
                onChange={handleChange}
                required
              >
                <MenuItem value="chief">Chief</MenuItem>
                <MenuItem value="regular">Regular</MenuItem>
                <MenuItem value="chef">Chef</MenuItem>
              </Select>
            </FormControl>
            {errors.attendant_type && <div style={styles.error}>{errors.attendant_type}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="vehicle_restrictions">Vehicle Restrictions:</label>
            <input id="vehicle_restrictions" type="text" name="vehicle_restrictions" value={formData.vehicle_restrictions} onChange={handleChange} required style={styles.input} />
            {errors.vehicle_restrictions && <div style={styles.error}>{errors.vehicle_restrictions}</div>}
          </div>
          {formData.attendant_type === 'chef' && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Dish Recipes:</label>
              {formData.dish_recipes.map((recipe, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={recipe.recipe_name}
                    onChange={(e) => handleRecipeChange(index, e)}
                    required
                    style={styles.input}
                    placeholder="Recipe Name"
                  />
                </div>
              ))}
              {errors.dish_recipes && <div style={styles.error}>{errors.dish_recipes}</div>}
              <Button onClick={handleAddRecipe} style={styles.button}>Add Recipe</Button>
            </div>
          )}
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          >
            Create Cabin Crew
          </button>
        </form>
      </div>
    </ThemeProvider>
  );
};

export default CreateCabinCrew;
