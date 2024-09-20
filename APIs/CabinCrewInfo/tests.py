from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from .models import CabinCrew, DishRecipe


class CabinCrewInfoTests(TestCase):

    def setUp(self):
        # Create sample data for testing
        self.crew1 = CabinCrew.objects.create(
            name="John Doe",
            age=35,
            gender="Male",
            nationality="American",
            known_languages="English, Spanish",
            attendant_type=CabinCrew.CHIEF,
            vehicle_restrictions="Boeing 737, Airbus A320"
        )
        self.crew2 = CabinCrew.objects.create(
            name="Jane Smith",
            age=29,
            gender="Female",
            nationality="British",
            known_languages="English, French",
            attendant_type=CabinCrew.REGULAR,
            vehicle_restrictions="Boeing 737"
        )
        self.chef = CabinCrew.objects.create(
            name="Gordon Ramsay",
            age=53,
            gender="Male",
            nationality="British",
            known_languages="English, Italian",
            attendant_type=CabinCrew.CHEF,
            vehicle_restrictions="Airbus A320"
        )
        self.dish1 = DishRecipe.objects.create(
            chef=self.chef,
            recipe_name="Beef Wellington"
        )
        self.dish2 = DishRecipe.objects.create(
            chef=self.chef,
            recipe_name="Scrambled Eggs"
        )

    def test_get_all_cabin_crew(self):
        response = self.client.get(reverse('cabin-crew-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]['name'], 'John Doe')
        self.assertEqual(response.data[1]['name'], 'Jane Smith')
        self.assertEqual(response.data[2]['name'], 'Gordon Ramsay')
        self.assertEqual(response.data[2]['dish_recipes'][0]['recipe_name'], 'Beef Wellington')
        self.assertEqual(response.data[2]['dish_recipes'][1]['recipe_name'], 'Scrambled Eggs')

    def test_create_cabin_crew(self):
        data = {
            'name': 'Emily Clark',
            'age': 28,
            'gender': 'Female',
            'nationality': 'Canadian',
            'known_languages': 'English, French',
            'attendant_type': 'regular',
            'vehicle_restrictions': 'Boeing 737'
        }
        response = self.client.post(reverse('cabin-crew-create'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CabinCrew.objects.count(), 4)
        self.assertEqual(CabinCrew.objects.get(name='Emily Clark').nationality, 'Canadian')

    def test_delete_cabin_crew(self):
        response = self.client.delete(reverse('cabin-crew-delete', args=[self.crew1.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CabinCrew.objects.count(), 2)
        with self.assertRaises(CabinCrew.DoesNotExist):
            CabinCrew.objects.get(pk=self.crew1.pk)

    def test_update_cabin_crew(self):
        data = {
            'name': 'John Doe',
            'age': 36,
            'gender': 'Male',
            'nationality': 'American',
            'known_languages': 'English, Spanish',
            'attendant_type': 'chief',
            'vehicle_restrictions': 'Boeing 737, Airbus A320'
        }
        response = self.client.put(reverse('cabin-crew-update', args=[self.crew1.pk]), data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_crew = CabinCrew.objects.get(pk=self.crew1.pk)
        self.assertEqual(updated_crew.age, 36)

    def test_invalid_create_cabin_crew(self):
        data = {
            'name': 'Invalid Crew',
            'age': -1,  # Invalid age
            'gender': 'Unknown',
            'nationality': 'Unknown',
            'known_languages': 'None',
            'attendant_type': 'invalid_type',  # Invalid attendant type
            'vehicle_restrictions': 'None'
        }
        response = self.client.post(reverse('cabin-crew-create'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        # Clean up after each test
        CabinCrew.objects.all().delete()
        DishRecipe.objects.all().delete()
