from django.db import models


class VehicleTypes(models.Model):
    vehicle_type = models.CharField(max_length=255)
    number_of_seats = models.IntegerField()
    seating_plan = models.CharField(max_length=255)
    crew_limit = models.IntegerField()
    passenger_limit = models.IntegerField()

    def __str__(self):
        return self.vehicle_type


class Flights(models.Model):
    flight_number = models.CharField(max_length=10, primary_key=True)
    flight_date = models.DateTimeField()
    flight_duration = models.DurationField()  # Change this to DurationField
    flight_distance = models.FloatField()
    source_country = models.CharField(max_length=255)
    source_city = models.CharField(max_length=255)
    source_airport_name = models.CharField(max_length=255)
    source_airport_code = models.CharField(max_length=3)
    destination_country = models.CharField(max_length=255)
    destination_city = models.CharField(max_length=255)
    destination_airport_name = models.CharField(max_length=255)
    destination_airport_code = models.CharField(max_length=3)
    vehicle_type = models.ForeignKey(VehicleTypes, on_delete=models.CASCADE)
    shared_flight = models.BooleanField(default=False)

    def __str__(self):
        return self.flight_number

class FlightLocations(models.Model):
    country = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    airport_name = models.CharField(max_length=255)
    airport_code = models.CharField(max_length=3)  # Assuming IATA codes

    def __str__(self):
        return f"{self.city}, {self.country} - {self.airport_name} ({self.airport_code})"