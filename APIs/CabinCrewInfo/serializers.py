# serializers.py
from rest_framework import serializers
from .models import CabinCrew, DishRecipe


class DishRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DishRecipe
        fields = ['id', 'recipe_name']


class CabinCrewSerializer(serializers.ModelSerializer):
    dish_recipes = DishRecipeSerializer(many=True, read_only=True, source='dishrecipe_set')

    class Meta:
        model = CabinCrew
        fields = ['attendant_id', 'name', 'age', 'gender', 'nationality', 'known_languages', 'attendant_type', 'vehicle_restrictions', 'dish_recipes']
