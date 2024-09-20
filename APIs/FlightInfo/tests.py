from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import VehicleTypes, Flights
from django.utils import timezone
from datetime import timedelta

class FlightInfoTests(TestCase):

    def setUp(self):
        # Create sample data for testing
        self.vehicle_type = VehicleTypes.objects.create(
            vehicle_type="Boeing 737",
            number_of_seats=200,
            seating_plan="2-2",
            crew_limit=10,
            passenger_limit=190
        )
        self.flight1 = Flights.objects.create(
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
        self.flight2 = Flights.objects.create(
            flight_number="BA5678",
            flight_date=timezone.now() + timedelta(days=2),
            flight_duration=timedelta(hours=3),
            flight_distance=1000.0,
            source_country="UK",
            source_city="London",
            source_airport_name="Heathrow",
            source_airport_code="LHR",
            destination_country="France",
            destination_city="Paris",
            destination_airport_name="Charles de Gaulle",
            destination_airport_code="CDG",
            vehicle_type=self.vehicle_type,
            shared_flight=True
        )

    def test_get_all_flights(self):
        response = self.client.get(reverse('all-flights'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['flight_number'], 'AA1234')
        self.assertEqual(response.data[1]['flight_number'], 'BA5678')

    def test_get_flight_info(self):
        response = self.client.get(reverse('flight-info'), {'flight_number': 'AA1234'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['flight_number'], 'AA1234')

    def test_create_flight(self):
        data = {
            'flight_number': 'UA1111',
            'flight_date': timezone.now() + timedelta(days=3),
            'flight_duration': timedelta(hours=4),
            'flight_distance': 1200.0,
            'source_country': 'USA',
            'source_city': 'San Francisco',
            'source_airport_name': 'SFO',
            'source_airport_code': 'SFO',
            'destination_country': 'Japan',
            'destination_city': 'Tokyo',
            'destination_airport_name': 'Narita',
            'destination_airport_code': 'NRT',
            'vehicle_type': self.vehicle_type.pk,
            'shared_flight': False
        }
        response = self.client.post(reverse('flight-create'), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Flights.objects.count(), 3)
        self.assertEqual(Flights.objects.get(flight_number='UA1111').destination_city, 'Tokyo')

    def test_delete_flight(self):
        response = self.client.delete(reverse('flight-delete', args=[self.flight1.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Flights.objects.count(), 1)
        with self.assertRaises(Flights.DoesNotExist):
            Flights.objects.get(pk=self.flight1.pk)

    def test_update_flight(self):
        data = {
            'flight_number': 'AA1234',
            'flight_date': timezone.now() + timedelta(days=1),
            'flight_duration': timedelta(hours=2),
            'flight_distance': 600.0,  # Updated distance
            'source_country': 'USA',
            'source_city': 'New York',
            'source_airport_name': 'JFK',
            'source_airport_code': 'JFK',
            'destination_country': 'UK',
            'destination_city': 'London',
            'destination_airport_name': 'Heathrow',
            'destination_airport_code': 'LHR',
            'vehicle_type': self.vehicle_type.pk,
            'shared_flight': False
        }
        response = self.client.put(reverse('flight-update', args=[self.flight1.pk]), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_flight = Flights.objects.get(pk=self.flight1.pk)
        self.assertEqual(updated_flight.flight_distance, 600.0)

    def test_invalid_create_flight(self):
        data = {
            'flight_number': '',
            'flight_date': timezone.now() + timedelta(days=3),
            'flight_duration': timedelta(hours=4),
            'flight_distance': -500.0,  # Invalid distance
            'source_country': 'USA',
            'source_city': 'San Francisco',
            'source_airport_name': 'SFO',
            'source_airport_code': 'SFO',
            'destination_country': 'Japan',
            'destination_city': 'Tokyo',
            'destination_airport_name': 'Narita',
            'destination_airport_code': 'NRT',
            'vehicle_type': self.vehicle_type.pk,
            'shared_flight': False
        }
        response = self.client.post(reverse('flight-create'), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        # Clean up after each test
        Flights.objects.all().delete()
        VehicleTypes.objects.all().delete()
