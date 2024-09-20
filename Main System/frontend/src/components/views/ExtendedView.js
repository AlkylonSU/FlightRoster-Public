import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import Modal from 'react-modal';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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

Modal.setAppElement('#root');

const PassengersTable = ({ passengers, onPassengerSelect, onDeletePassenger }) => (
  <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Full Name</TableCell>
          <TableCell>Age</TableCell>
          <TableCell>Gender</TableCell>
          <TableCell>Nationality</TableCell>
          <TableCell>Seat Type</TableCell>
          <TableCell>Children</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {passengers.map((passenger) => (
          <TableRow key={passenger.passenger_id}>
            <TableCell onClick={() => onPassengerSelect(passenger)}>{passenger.passenger_id}</TableCell>
            <TableCell onClick={() => onPassengerSelect(passenger)}>{passenger.passenger_name}</TableCell>
            <TableCell onClick={() => onPassengerSelect(passenger)}>{passenger.age}</TableCell>
            <TableCell onClick={() => onPassengerSelect(passenger)}>{passenger.gender}</TableCell>
            <TableCell onClick={() => onPassengerSelect(passenger)}>{passenger.nationality}</TableCell>
            <TableCell onClick={() => onPassengerSelect(passenger)}>{passenger.seat_type}</TableCell>
            <TableCell onClick={() => onPassengerSelect(passenger)}>
              {passenger.children && passenger.children.length > 0 ? (
                <ul>
                  {passenger.children.map(child => (
                    <li key={child.child_id}>{child.child_name}</li>
                  ))}
                </ul>
              ) : (
                "No children"
              )}
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" color="secondary" onClick={() => onDeletePassenger(passenger.passenger_id)}>Delete</Button>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const CrewTable = ({ crew, onCrewMemberSelect, crewType }) => (
  <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
    <Typography variant="h6" sx={{ padding: 2 }}>{crewType} Crew</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Age</TableCell>
          <TableCell>Nationality</TableCell>
          <TableCell>Languages</TableCell>
          <TableCell>Seniority Level</TableCell>
          {crew[0]?.vehicle_restriction && <TableCell>Vehicle Restriction</TableCell>}
          {crew[0]?.allowed_range && <TableCell>Allowed Range</TableCell>}
          {crewType === 'Cabin' && <TableCell>Dishes</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {crew.map((member) => (
          <TableRow key={member.pilot_id || member.attendant_id} onClick={() => onCrewMemberSelect(member)}>
            <TableCell>{member.pilot_id || member.attendant_id}</TableCell>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.age}</TableCell>
            <TableCell>{member.nationality}</TableCell>
            <TableCell>{member.known_languages}</TableCell>
            <TableCell>{member.seniority_level || member.attendant_type}</TableCell>
            {member.vehicle_restriction && <TableCell>{member.vehicle_restriction}</TableCell>}
            {member.allowed_range && <TableCell>{member.allowed_range}</TableCell>}
            {crewType === 'Cabin' && (
              <TableCell>
                {member.dish_recipes && member.dish_recipes.length > 0 ? (
                  <ul>
                    {member.dish_recipes.map((dish) => (
                      <li key={dish.id}>{dish.recipe_name}</li>
                    ))}
                  </ul>
                ) : (
                  "Cabin Crew Member not suitable for dishes"
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const UserCard = ({ user }) => (
  <Box className="user-card" sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }}>
    <Typography variant="h6">User Information</Typography>
    <Typography>ID: {user.pilot_id || user.attendant_id || user.passenger_id}</Typography>
    <Typography>Name: {user.name || user.passenger_name}</Typography>
    <Typography>Age: {user.age}</Typography>
    <Typography>Gender: {user.gender}</Typography>
    <Typography>Nationality: {user.nationality}</Typography>
    {user.seat_type && <Typography>Seat Type: {user.seat_type}</Typography>}
    {user.vehicle_restriction && <Typography>Vehicle Restriction: {user.vehicle_restriction}</Typography>}
    {user.allowed_range && <Typography>Allowed Range: {user.allowed_range}</Typography>}
    {user.known_languages && <Typography>Languages: {user.known_languages}</Typography>}
    {user.attendant_type && <Typography>Crew Type: {user.attendant_type}</Typography>}
    {user.seniority_level && <Typography>Seniority Level: {user.seniority_level}</Typography>}
    {user.children && user.children.length > 0 && (
      <Box>
        <Typography>Children:</Typography>
        <ul>
          {user.children.map(child => (
            <li key={child.child_id}>{child.child_name}</li>
          ))}
        </ul>
      </Box>
    )}
    {user.dish_recipes && user.dish_recipes.length > 0 ? (
      <Box>
        <Typography>Dishes:</Typography>
        <ul>
          {user.dish_recipes.map((dish) => (
            <li key={dish.id}>{dish.recipe_name}</li>
          ))}
        </ul>
      </Box>
    ) : (
      <Typography>Cabin Crew Member not suitable for dishes</Typography>
    )}
  </Box>
);

const ExtendedView = () => {
  const { flightNumber } = useParams();
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([]);
  const [flightCrew, setFlightCrew] = useState([]);
  const [cabinCrew, setCabinCrew] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState({ passengers: false, crew: false });

  useEffect(() => {
    fetch(`http://localhost:8000/api/passengerinfo/flight/${flightNumber}/`)
      .then(response => response.json())
      .then(data => {
        setPassengers(data);
        setDataLoaded(prevState => ({ ...prevState, passengers: true }));
      })
      .catch(error => {
        console.error('Error fetching passengers:', error);
        setDataLoaded(prevState => ({ ...prevState, passengers: true }));
      });

    fetch(`http://localhost:8080/backend/assigned-crew/${flightNumber}/`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        const flightCrew = data.filter(member => member.type === 'flight');
        const cabinCrew = data.filter(member => member.type === 'cabin');
        setFlightCrew(flightCrew);
        setCabinCrew(cabinCrew);
        setDataLoaded(prevState => ({ ...prevState, crew: true }));
      })
      .catch(error => {
        console.error('Error fetching crew:', error);
        setDataLoaded(prevState => ({ ...prevState, crew: true }));
      });
  }, [flightNumber]);

  useEffect(() => {
    if (dataLoaded.passengers && dataLoaded.crew) {
      setLoading(false);
    }
  }, [dataLoaded]);

  const handlePassengerSelect = (passenger) => {
    setSelectedUser(passenger);
  };

  const handleCrewMemberSelect = (member) => {
    setSelectedUser(member);
  };

  const handleDeletePassenger = async (passengerId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/passengerinfo/delete/${passengerId}/`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        setPassengers(passengers.filter(passenger => passenger.passenger_id !== passengerId));
      } else {
        console.error('Error deleting passenger:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting passenger:', error);
    }
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
            Extended View
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <ClipLoader size={50} color={"#123abc"} loading={loading} />
              <Typography variant="h6" color="textSecondary" sx={{ marginLeft: 2 }}>Loading data, please wait...</Typography>
            </Box>
          ) : (
            <>
              <PassengersTable
                passengers={passengers}
                onPassengerSelect={handlePassengerSelect}
                onDeletePassenger={handleDeletePassenger}
              />
              <CrewTable crew={flightCrew} onCrewMemberSelect={handleCrewMemberSelect} crewType="Flight" />
              <CrewTable crew={cabinCrew} onCrewMemberSelect={handleCrewMemberSelect} crewType="Cabin" />
              {selectedUser && <UserCard user={selectedUser} />}
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ExtendedView;
