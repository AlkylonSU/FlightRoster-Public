from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FlightSerializer, FlightLocationsSerializer
from .models import Flights, FlightLocations
from django.utils.timezone import make_aware

class FlightInfoView(APIView):
    def get(self, request):
        # Build query based on request parameters
        query_params = {}
        if 'flight_number' in request.GET:
            query_params['flight_number'] = request.GET['flight_number']
        if 'source_city' in request.GET:
            query_params['source_city'] = request.GET['source_city']
        if 'destination_city' in request.GET:
            query_params['destination_city'] = request.GET['destination_city']
        if 'source_airport_code' in request.GET:
            query_params['source_airport_code'] = request.GET['source_airport_code']
        if 'destination_airport_code' in request.GET:
            query_params['destination_airport_code'] = request.GET['destination_airport_code']
        if 'min_date' in request.GET:
            min_date = make_aware(request.GET['min_date'])
            query_params['flight_date__gte'] = min_date
        if 'max_date' in request.GET:
            max_date = make_aware(request.GET['max_date'])
            query_params['flight_date__lte'] = max_date

        # Query the database using Django models
        flights = Flights.objects.filter(**query_params)

        # Serialize the data
        serializer = FlightSerializer(flights, many=True)

        return Response(serializer.data)

class AllFlightsView(APIView):
    def get(self, request):
        # Query all flights from the database using Django models
        flights = Flights.objects.all()

        # Serialize the data
        serializer = FlightSerializer(flights, many=True)

        return Response(serializer.data)

class FlightCreate(APIView):
    def post(self, request):
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FlightUpdate(APIView):
    def put(self, request, pk):
        try:
            flight = Flights.objects.get(pk=pk)
        except Flights.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = FlightSerializer(flight, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FlightDelete(APIView):
    def delete(self, request, pk):
        try:
            flight = Flights.objects.get(pk=pk)
            flight.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Flights.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class FlightLocationsList(APIView):
    def get(self, request):
        locations = FlightLocations.objects.all()
        serializer = FlightLocationsSerializer(locations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateFlightLocationView(APIView):
    def post(self, request):
        serializer = FlightLocationsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
