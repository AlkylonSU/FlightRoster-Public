from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import FlightCrew


class FlightCrewInfoTests(TestCase):

    def setUp(self):
        # Create sample data for testing
        self.crew1 = FlightCrew.objects.create(
            name="Captain Kirk",
            age=40,
            gender="Male",
            nationality="American",
            known_languages="English, Klingon",
            vehicle_restriction="Enterprise NCC-1701",
            allowed_range=5000,
            seniority_level=FlightCrew.SENIOR
        )
        self.crew2 = FlightCrew.objects.create(
            name="Lt. Uhura",
            age=30,
            gender="Female",
            nationality="American",
            known_languages="English, Swahili",
            vehicle_restriction="Enterprise NCC-1701",
            allowed_range=3000,
            seniority_level=FlightCrew.JUNIOR
        )

    def test_get_all_flight_crew(self):
        response = self.client.get(reverse('flight-crew-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Captain Kirk')
        self.assertEqual(response.data[1]['name'], 'Lt. Uhura')

    def test_create_flight_crew(self):
        data = {
            'name': 'Spock',
            'age': 35,
            'gender': 'Male',
            'nationality': 'Vulcan',
            'known_languages': 'English, Vulcan',
            'vehicle_restriction': 'Enterprise NCC-1701',
            'allowed_range': 4500,
            'seniority_level': 'senior'
        }
        response = self.client.post(reverse('flight-crew-create'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FlightCrew.objects.count(), 3)
        self.assertEqual(FlightCrew.objects.get(name='Spock').nationality, 'Vulcan')

    def test_delete_flight_crew(self):
        response = self.client.delete(reverse('flight-crew-delete', args=[self.crew1.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(FlightCrew.objects.count(), 1)
        with self.assertRaises(FlightCrew.DoesNotExist):
            FlightCrew.objects.get(pk=self.crew1.pk)

    def test_update_flight_crew(self):
        data = {
            'name': 'Captain Kirk',
            'age': 41,
            'gender': 'Male',
            'nationality': 'American',
            'known_languages': 'English, Klingon',
            'vehicle_restriction': 'Enterprise NCC-1701',
            'allowed_range': 5000,
            'seniority_level': 'senior'
        }
        response = self.client.put(reverse('flight-crew-update', args=[self.crew1.pk]), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_crew = FlightCrew.objects.get(pk=self.crew1.pk)
        self.assertEqual(updated_crew.age, 41)

    def test_invalid_create_flight_crew(self):
        data = {
            'name': 'Invalid Crew',
            'age': -1,  # Invalid age
            'gender': 'Unknown',
            'nationality': 'Unknown',
            'known_languages': 'None',
            'vehicle_restriction': 'None',
            'allowed_range': -100,  # Invalid range
            'seniority_level': 'invalid_level'  # Invalid seniority level
        }
        response = self.client.post(reverse('flight-crew-create'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        # Clean up after each test
        FlightCrew.objects.all().delete()
