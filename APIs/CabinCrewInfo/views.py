from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CabinCrew, DishRecipe
from .serializers import CabinCrewSerializer


class CabinCrewList(APIView):
    def get(self, request):
        crew_members = CabinCrew.objects.all()
        serializer = CabinCrewSerializer(crew_members, many=True)
        return Response(serializer.data)


class CabinCrewCreate(APIView):
    def post(self, request):
        serializer = CabinCrewSerializer(data=request.data)
        if serializer.is_valid():
            cabin_crew = serializer.save()
            if 'dish_recipes' in request.data:
                for recipe_data in request.data['dish_recipes']:
                    DishRecipe.objects.create(chef=cabin_crew, **recipe_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CabinCrewUpdate(APIView):
    def put(self, request, pk):
        try:
            crew_member = CabinCrew.objects.get(pk=pk)
        except CabinCrew.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CabinCrewSerializer(crew_member, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CabinCrewDelete(APIView):
    def delete(self, request, pk):
        try:
            crew_member = CabinCrew.objects.get(pk=pk)
            crew_member.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CabinCrew.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
