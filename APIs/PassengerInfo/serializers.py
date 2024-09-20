from rest_framework import serializers
from .models import Passengers, Children, Flights

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Children
        fields = '__all__'
        extra_kwargs = {
            'parent': {'required': False}
        }

class PassengerSerializer(serializers.ModelSerializer):
    flight_id = serializers.CharField(write_only=True)
    flight = serializers.PrimaryKeyRelatedField(queryset=Flights.objects.all(), write_only=True, required=False)
    children = ChildSerializer(many=True, write_only=True)

    class Meta:
        model = Passengers
        fields = '__all__'
        extra_kwargs = {
            'passenger_id': {'read_only': True},
        }

    def create(self, validated_data):
        flight_id = validated_data.pop('flight_id')
        validated_data['flight'] = Flights.objects.get(flight_number=flight_id)
        children_data = validated_data.pop('children', [])
        passenger = Passengers.objects.create(**validated_data)
        for child_data in children_data:
            child_data['parent'] = passenger
            Children.objects.create(**child_data)
        return passenger

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['children'] = ChildSerializer(instance.children_set.all(), many=True).data
        return representation
