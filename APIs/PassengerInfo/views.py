from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import PassengerSerializer, ChildSerializer
from .models import Passengers, Children

class PassengersOnFlight(APIView):
    def get(self, request, flight_id):
        # Query passengers on the specified flight using Django models
        passengers = Passengers.objects.filter(flight__flight_number=flight_id)

        # Serialize the passengers data
        passenger_serializer = PassengerSerializer(passengers, many=True)

        # Return serialized passengers data as JSON response
        return Response(passenger_serializer.data)

class PassengerCreate(APIView):
    def post(self, request):
        serializer = PassengerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PassengerUpdate(APIView):
    def put(self, request, pk):
        try:
            passenger = Passengers.objects.get(pk=pk)
        except Passengers.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = PassengerSerializer(passenger, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PassengerDelete(APIView):
    def delete(self, request, pk):
        try:
            passenger = Passengers.objects.get(pk=pk)
            passenger.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Passengers.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
