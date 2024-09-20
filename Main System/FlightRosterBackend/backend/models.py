from django.db import models
from django.contrib.auth.models import User

class Flight(models.Model):
    flight_number = models.CharField(max_length=10, unique=True)
    flight_date = models.DateTimeField()
    # Other flight details

class CrewMember(models.Model):
    CREW_TYPE_CHOICES = (
        ('flight', 'Flight Crew'),
        ('cabin', 'Cabin Crew'),
    )
    name = models.CharField(max_length=100)
    attendant_id = models.IntegerField(null=True, blank=True)
    pilot_id = models.IntegerField(null=True, blank=True)
    crew_type = models.CharField(max_length=6, choices=CREW_TYPE_CHOICES)
    seniority_level = models.CharField(max_length=10)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='crew_members')

class AssignedCrew(models.Model):
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='assigned_crew')
    crew_member = models.ForeignKey(CrewMember, on_delete=models.CASCADE)
