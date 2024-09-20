from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import Passengers, Children
from APIs.FlightInfo.models import Flights, VehicleTypes
from django.utils import timezone
from datetime import timedelta

class PassengerInfoTests(TestCase):

    def setUp(self):
        # Create sample data for testing
        self.vehicle_type = VehicleTypes.objects.create(
            vehicle_type="Boeing 737",
            number_of_seats=200,
            seating_plan="2-2",
            crew_limit=10,
            passenger_limit=190
        )
        self.flight = Flights.objects.create(
            flight_number="AA1234",
            flight_date=timezone.now() + timedelta(days=1),
            flight_duration=timedelta(hours=2),
            flight_distance=500.0,
            source_country="USA",
            source_city="New York",
            source_airport_name="JFK",
            source_airport_code="JFK",
            destination_country="UK",
            destination_city="London",
            destination_airport_name="Heathrow",
            destination_airport_code="LHR",
            vehicle_type=self.vehicle_type,
            shared_flight=False
        )
        self.passenger1 = Passengers.objects.create(
            flight=self.flight,
            passenger_name="Alice",
            age=30,
            gender="Female",
            nationality="American",
            seat_type="Economy",
            seat_number="12A"
        )
        self.passenger2 = Passengers.objects.create(
            flight=self.flight,
            passenger_name="Bob",
            age=45,
            gender="Male",
            nationality="British",
            seat_type="Business",
            seat_number="1A"
        )
        self.child = Children.objects.create(
            parent=self.passenger1,
            child_name="Charlie",
            age=5,
            gender="Male",
            nationality="American"
        )

    def test_get_passengers_on_flight(self):
        response = self.client.get(reverse('passengers-on-flight', args=['AA1234']))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['passenger_name'], 'Alice')
        self.assertEqual(response.data[0]['children'][0]['child_name'], 'Charlie')
        self.assertEqual(response.data[1]['passenger_name'], 'Bob')

    def test_create_passenger(self):
        data = {
            'flight_id': self.flight.pk,
            'passenger_name': 'Charlie Brown',
            'age': 25,
            'gender': 'Male',
            'nationality': 'American',
            'seat_type': 'Economy',
            'seat_number': '14B'
        }
        response = self.client.post(reverse('passenger-create'), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Passengers.objects.count(), 3)
        self.assertEqual(Passengers.objects.get(passenger_name='Charlie Brown').seat_number, '14B')

    def test_delete_passenger(self):
        response = self.client.delete(reverse('passenger-delete', args=[self.passenger1.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Passengers.objects.count(), 1)
        with self.assertRaises(Passengers.DoesNotExist):
            Passengers.objects.get(pk=self.passenger1.pk)

    def test_update_passenger(self):
        data = {
            'flight_id': self.flight.pk,
            'passenger_name': 'Alice',
            'age': 31,  # Updated age
            'gender': 'Female',
            'nationality': 'American',
            'seat_type': 'Economy',
            'seat_number': '12A'
        }
        response = self.client.put(reverse('passenger-update', args=[self.passenger1.pk]), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_passenger = Passengers.objects.get(pk=self.passenger1.pk)
        self.assertEqual(updated_passenger.age, 31)

    def test_invalid_create_passenger(self):
        data = {
            'flight_id': self.flight.pk,
            'passenger_name': '',
            'age': -5,  # Invalid age
            'gender': 'Unknown',
            'nationality': 'Unknown',
            'seat_type': 'Economy',
            'seat_number': '15C'
        }
        response = self.client.post(reverse('passenger-create'), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        # Clean up after each test
        Children.objects.all().delete()
        Passengers.objects.all().delete()
        Flights.objects.all().delete()
        VehicleTypes.objects.all().delete()
