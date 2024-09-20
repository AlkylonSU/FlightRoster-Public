from django.db import models


class CabinCrew(models.Model):
    CHIEF = 'chief'
    REGULAR = 'regular'
    CHEF = 'chef'

    ATTENDANT_TYPE_CHOICES = [
        (CHIEF, 'Chief'),
        (REGULAR, 'Regular'),
        (CHEF, 'Chef'),
    ]

    attendant_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    nationality = models.CharField(max_length=50)
    known_languages = models.CharField(max_length=200)
    attendant_type = models.CharField(max_length=10, choices=ATTENDANT_TYPE_CHOICES)
    vehicle_restrictions = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class DishRecipe(models.Model):
    chef = models.ForeignKey(CabinCrew, on_delete=models.CASCADE, limit_choices_to={'attendant_type': 'chef'})
    recipe_name = models.CharField(max_length=100)

    def __str__(self):
        return self.recipe_name
