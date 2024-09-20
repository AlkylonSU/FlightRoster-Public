from django.db import models


class FlightCrew(models.Model):
    SENIOR = 'senior'
    JUNIOR = 'junior'
    TRAINEE = 'trainee'

    SENIORITY_LEVEL_CHOICES = [
        (SENIOR, 'Senior'),
        (JUNIOR, 'Junior'),
        (TRAINEE, 'Trainee'),
    ]

    pilot_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    nationality = models.CharField(max_length=50)
    known_languages = models.CharField(max_length=200)
    vehicle_restriction = models.CharField(max_length=100)
    allowed_range = models.PositiveIntegerField()
    seniority_level = models.CharField(max_length=10, choices=SENIORITY_LEVEL_CHOICES)

    def __str__(self):
        return self.name
