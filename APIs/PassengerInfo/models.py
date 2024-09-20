from django.db import models
from FlightInfo.models import Flights  # Import the Flights model from the Flight info app

class Passengers(models.Model):
    passenger_id = models.AutoField(primary_key=True)
    flight = models.ForeignKey(Flights, on_delete=models.CASCADE)
    passenger_name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    nationality = models.CharField(max_length=255)
    seat_type = models.CharField(max_length=20)
    seat_number = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.passenger_name} - Flight {self.flight.flight_number}"


class Children(models.Model):
    child_id = models.AutoField(primary_key=True)
    parent = models.ForeignKey(Passengers, on_delete=models.CASCADE)
    child_name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    nationality = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.child_name} (Child of {self.parent.passenger_name})"