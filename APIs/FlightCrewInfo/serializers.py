# serializers.py
from rest_framework import serializers
from .models import FlightCrew


class FlightCrewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightCrew
        fields = ['pilot_id', 'name', 'age', 'gender', 'nationality', 'known_languages', 'vehicle_restriction', 'allowed_range', 'seniority_level']
