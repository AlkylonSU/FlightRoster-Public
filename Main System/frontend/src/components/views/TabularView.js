import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { AppBar, Toolbar, Typography, Button, Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './PassengerTable.css'; // Import CSS file for styling

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

const CombinedTable = ({ data }) => {
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleRowClick = (person) => {
    setSelectedPerson(person);
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        All People on the Flight
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Nationality</TableCell>
              <TableCell>Additional Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((person) => (
              <TableRow key={person.id} onClick={() => handleRowClick(person)}>
                <TableCell>{person.id}</TableCell>
                <TableCell>{person.type}</TableCell>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.age}</TableCell>
                <TableCell>{person.gender}</TableCell>
                <TableCell>{person.nationality}</TableCell>
                <TableCell>{person.additionalInfo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedPerson && (
        <Box className="user-card" sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
          <Typography variant="h6">User Information</Typography>
          <Typography>ID: {selectedPerson.id}</Typography>
          <Typography>Name: {selectedPerson.name}</Typography>
          <Typography>Age: {selectedPerson.age}</Typography>
          <Typography>Gender: {selectedPerson.gender}</Typography>
          <Typography>Nationality: {selectedPerson.nationality}</Typography>
          <Typography>Type: {selectedPerson.type}</Typography>
          <Typography>Additional Info: {selectedPerson.additionalInfo}</Typography>
        </Box>
      )}
    </Box>
  );
};

const TabularView = () => {
  const { flightNumber } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/passengerinfo/flight/${flightNumber}/`);
        const passengers = await response.json();
        const formattedPassengers = passengers.map(passenger => ({
          id: passenger.passenger_id,
          type: 'Passenger',
          name: passenger.passenger_name,
          age: passenger.age,
          gender: passenger.gender,
          nationality: passenger.nationality,
          additionalInfo: `Seat Type: ${passenger.seat_type}, Seat Number: ${passenger.seat_number} , Children: ${
            passenger.children && passenger.children.length > 0
              ? passenger.children.map(child => child.child_name).join(', ')
              : 'No children'
          }`
        }));
        return formattedPassengers;
      } catch (error) {
        console.error('Error fetching passengers:', error);
        return [];
      }
    };

    const fetchCrew = async () => {
      try {
        const response = await fetch(`http://localhost:8080/backend/assigned-crew/${flightNumber}/`);
        const crew = await response.json();
        const formattedCrew = crew.map(crewMember => {
          const isFlightCrew = crewMember.type === 'flight';
          const id = isFlightCrew ? crewMember.pilot_id : crewMember.attendant_id;
          const additionalInfo = isFlightCrew
            ? `Vehicle Restriction: ${crewMember.vehicle_restriction || 'N/A'}, Allowed Range: ${crewMember.allowed_range || 'N/A'}, Seniority Level: ${crewMember.seniority_level || 'N/A'}`
            : `Vehicle Restrictions: ${crewMember.vehicle_restrictions || 'N/A'}, Attendant Type: ${crewMember.attendant_type || 'N/A'}, Dishes: ${
                crewMember.dish_recipes && crewMember.dish_recipes.length > 0
                  ? crewMember.dish_recipes.map(dish => dish.recipe_name).join(', ')
                  : 'Cabin Crew Member not suitable for dishes'
              }`;

          return {
            id,
            type: isFlightCrew ? 'Flight Crew' : 'Cabin Crew',
            name: crewMember.name,
            age: crewMember.age,
            gender: crewMember.gender,
            nationality: crewMember.nationality,
            additionalInfo
          };
        });
        return formattedCrew;
      } catch (error) {
        console.error('Error fetching crew:', error);
        return [];
      }
    };

    const fetchData = async () => {
      const passengers = await fetchPassengers();
      const crew = await fetchCrew();
      setData([...passengers, ...crew]);
      setLoading(false); // Set loading to false once data is fetched
    };

    fetchData();
  }, [flightNumber]);

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
            Tabular View - Interior of the Plane
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
              <Typography variant="h6" color="textSecondary">Loading data, please wait...</Typography>
            </Box>
          ) : (
            <CombinedTable data={data} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default TabularView;
