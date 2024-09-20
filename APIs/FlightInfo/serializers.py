from rest_framework import serializers
from .models import Flights, VehicleTypes, FlightLocations
from datetime import timedelta

class VehicleTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleTypes
        fields = '__all__'

class FlightSerializer(serializers.ModelSerializer):
    vehicle_type = VehicleTypeSerializer()
    flight_duration = serializers.CharField()

    class Meta:
        model = Flights
        fields = [
            'flight_number',
            'flight_date',
            'flight_duration',
            'flight_distance',
            'source_country',
            'source_city',
            'source_airport_name',
            'source_airport_code',
            'destination_country',
            'destination_city',
            'destination_airport_name',
            'destination_airport_code',
            'vehicle_type',
            'shared_flight'
        ]

    def create(self, validated_data):
        vehicle_type_data = validated_data.pop('vehicle_type')
        flight_duration_str = validated_data.pop('flight_duration')
        hours, minutes = map(int, flight_duration_str.split(':'))
        validated_data['flight_duration'] = timedelta(hours=hours, minutes=minutes)
        vehicle_type, created = VehicleTypes.objects.get_or_create(**vehicle_type_data)
        flight = Flights.objects.create(vehicle_type=vehicle_type, **validated_data)
        return flight

    def update(self, instance, validated_data):
        vehicle_type_data = validated_data.pop('vehicle_type', None)
        flight_duration_str = validated_data.pop('flight_duration', None)
        
        if flight_duration_str is not None:
            hours, minutes = map(int, flight_duration_str.split(':'))
            instance.flight_duration = timedelta(hours=hours, minutes=minutes)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if vehicle_type_data:
            vehicle_type, created = VehicleTypes.objects.get_or_create(**vehicle_type_data)
            instance.vehicle_type = vehicle_type
        
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        duration = instance.flight_duration
        total_seconds = int(duration.total_seconds())
        hours, remainder = divmod(total_seconds, 3600)
        minutes = remainder // 60
        representation['flight_duration'] = f'{hours:02}:{minutes:02}'
        return representation

class FlightLocationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlightLocations
        fields = '__all__'