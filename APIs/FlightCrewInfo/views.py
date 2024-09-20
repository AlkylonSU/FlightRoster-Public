from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FlightCrew
from .serializers import FlightCrewSerializer


class FlightCrewList(APIView):
    def get(self, request):
        flight_crews = FlightCrew.objects.all()
        serializer = FlightCrewSerializer(flight_crews, many=True)
        return Response(serializer.data)


class FlightCrewCreate(APIView):
    def post(self, request):
        serializer = FlightCrewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FlightCrewUpdate(APIView):
    def put(self, request, pk):
        try:
            flight_crew = FlightCrew.objects.get(pk=pk)
        except FlightCrew.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = FlightCrewSerializer(flight_crew, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FlightCrewDelete(APIView):
    def delete(self, request, pk):
        try:
            flight_crew = FlightCrew.objects.get(pk=pk)
            flight_crew.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FlightCrew.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
