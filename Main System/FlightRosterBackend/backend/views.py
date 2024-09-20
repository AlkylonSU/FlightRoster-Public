from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from .models import Flight, CrewMember, AssignedCrew
from django.conf import settings
import requests
import random
from django.urls import reverse
from datetime import date
import json
from django.contrib.auth import authenticate
from datetime import datetime
from django.views import View
import logging
from django.http import HttpResponse
from django.utils import timezone

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)


logger = logging.getLogger(__name__)

class FetchAndAssignCrew(APIView):
    def get(self, request, flight_number):
        try:
            # Query the flight information from the API
            flight_response = requests.get('http://localhost:8000/api/flightinfo/all-flights/')
            flight_response.raise_for_status()
            flights = flight_response.json()
            flight_data = next((flight for flight in flights if flight['flight_number'] == flight_number), None)
            
            if not flight_data:
                return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)

            # Create or retrieve the Flight object
            flight_date = timezone.now()
            try:
                flight = Flight.objects.get(flight_number=flight_number)
                created = False
            except Flight.DoesNotExist:
                flight = Flight.objects.create(flight_number=flight_number, flight_date=flight_date)
                created = True
            
            # Fetch or create the assigned crew for the flight
            assigned_crew = AssignedCrew.objects.filter(flight=flight)
            if not assigned_crew.exists():
                assigned_crew = []

                # Fetch cabin crew members
                cabin_response = requests.get('http://localhost:8000/api/cabincrewinfo/all/')
                cabin_response.raise_for_status()
                cabin_crew = cabin_response.json()

                senior_attendants = [crew for crew in cabin_crew if crew['attendant_type'] == 'chief']
                regular_attendants = [crew for crew in cabin_crew if crew['attendant_type'] == 'regular']
                chefs = [crew for crew in cabin_crew if crew['attendant_type'] == 'chef']

                # Filter by vehicle restriction
                vehicle_type = flight_data['vehicle_type']['vehicle_type']
                flight_distance = flight_data['flight_distance']

                senior_attendants = [
                    crew for crew in senior_attendants 
                    if vehicle_type in crew['vehicle_restrictions'].split(', ')
                ]
                regular_attendants = [
                    crew for crew in regular_attendants 
                    if vehicle_type in crew['vehicle_restrictions'].split(', ')
                ]
                chefs = [
                    crew for crew in chefs 
                    if vehicle_type in crew['vehicle_restrictions'].split(', ')
                ]

                selected_seniors = random.sample(senior_attendants, min(2, len(senior_attendants)))
                selected_regulars = random.sample(regular_attendants, min(6, len(regular_attendants)))
                selected_chefs = random.sample(chefs, min(2, len(chefs)))
                selected_cabin_crew = selected_seniors + selected_regulars + selected_chefs

                for member in selected_cabin_crew:
                    crew_member, crew_created = CrewMember.objects.get_or_create(
                        name=member['name'],
                        crew_type='cabin',
                        seniority_level=member['attendant_type'],
                        flight=flight,
                        defaults={'attendant_id': member['attendant_id']}
                    )
                    if crew_created:
                        assigned_crew_instance = AssignedCrew.objects.create(flight=flight, crew_member=crew_member)
                        assigned_crew.append(assigned_crew_instance)

                # Fetch flight crew members
                flight_response = requests.get('http://localhost:8000/api/flightcrewinfo/all/')
                flight_response.raise_for_status()
                flight_crew = flight_response.json()

                senior_pilots = [crew for crew in flight_crew if crew['seniority_level'] == 'senior']
                junior_pilots = [crew for crew in flight_crew if crew['seniority_level'] == 'junior']
                trainees = [crew for crew in flight_crew if crew['seniority_level'] == 'trainee']

                # Filter by vehicle restriction and allowed range
                senior_pilots = [
                    crew for crew in senior_pilots 
                    if vehicle_type == crew['vehicle_restriction'] and crew['allowed_range'] >= flight_distance
                ]
                junior_pilots = [
                    crew for crew in junior_pilots 
                    if vehicle_type == crew['vehicle_restriction'] and crew['allowed_range'] >= flight_distance
                ]
                trainees = [
                    crew for crew in trainees 
                    if vehicle_type == crew['vehicle_restriction'] and crew['allowed_range'] >= flight_distance
                ]

                selected_seniors = random.sample(senior_pilots, min(1, len(senior_pilots)))
                selected_juniors = random.sample(junior_pilots, min(1, len(junior_pilots)))
                selected_trainees = random.sample(trainees, min(2, len(trainees)))
                selected_flight_crew = selected_seniors + selected_juniors + selected_trainees

                for member in selected_flight_crew:
                    crew_member, crew_created = CrewMember.objects.get_or_create(
                        name=member['name'],
                        crew_type='flight',
                        seniority_level=member['seniority_level'],
                        flight=flight,
                        defaults={'pilot_id': member['pilot_id']}
                    )
                    if crew_created:
                        assigned_crew_instance = AssignedCrew.objects.create(flight=flight, crew_member=crew_member)
                        assigned_crew.append(assigned_crew_instance)

            crew_data = [{'name': crew.crew_member.name, 'type': crew.crew_member.crew_type, 'seniority': crew.crew_member.seniority_level} for crew in assigned_crew]
            return Response(crew_data, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            logger.error(f'Error fetching crew data: {str(e)}')
            return Response({'error': f'Error fetching crew data: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f'An error occurred: {str(e)}', exc_info=True)
            return Response({'error': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class FetchAssignedCrew(APIView):
    def get(self, request, flight_number):
        try:
            flight = Flight.objects.get(flight_number=flight_number)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)
            
        assigned_crew = AssignedCrew.objects.filter(flight=flight)

        # Fetch all cabin and flight crew members from the external API
        cabin_response = requests.get('http://localhost:8000/api/cabincrewinfo/all/')
        flight_response = requests.get('http://localhost:8000/api/flightcrewinfo/all/')
        cabin_crew_data = cabin_response.json()
        flight_crew_data = flight_response.json()

        crew_data = []
        for crew in assigned_crew:
            crew_member = crew.crew_member
            crew_info = {
                'name': crew_member.name,
                'type': crew_member.crew_type,
                'seniority': crew_member.seniority_level,
            }

            # Fetch detailed information from the external API
            if crew_member.crew_type == 'flight':
                detailed_info = next((member for member in flight_crew_data if member['pilot_id'] == crew_member.pilot_id), None)
            elif crew_member.crew_type == 'cabin':
                detailed_info = next((member for member in cabin_crew_data if member['attendant_id'] == crew_member.attendant_id), None)

            # Add detailed information to the response
            if detailed_info:
                crew_info.update(detailed_info)

            crew_data.append(crew_info)

        return Response(crew_data, status=status.HTTP_200_OK)

def get_combined_data(flight_number):
    # Fetch data from existing APIs
    flight_info_response = requests.get(f'http://localhost:8000/api/flightinfo/all/?flight_number={flight_number}')
    crew_response = requests.get(f'http://localhost:8080/backend/assigned-crew/{flight_number}/')
    passengers_response = requests.get(f'http://localhost:8000/api/passengerinfo/flight/{flight_number}/')

    if flight_info_response.status_code != 200:
        raise Exception(f"Failed to fetch flight info data: {flight_info_response.text}")

    if crew_response.status_code != 200:
        raise Exception(f"Failed to fetch crew data: {crew_response.text}")

    if passengers_response.status_code != 200:
        raise Exception(f"Failed to fetch passenger data: {passengers_response.text}")

    flight_info_data = flight_info_response.json()[0]
    crew_data = crew_response.json()
    passengers_data = passengers_response.json()

    # Separate cabin and flight crew members
    cabin_crew_data = []
    flight_crew_data = []
    menu_data = []

    for crew in crew_data:
        if crew['type'] == 'flight':
            flight_crew_data.append(crew)
        elif crew['type'] == 'cabin':
            cabin_crew_data.append(crew)
            if crew['attendant_type'] == 'chef':
                for dish in crew['dish_recipes']:
                    menu_data.append({
                        "id": dish['id'],
                        "recipe_name": dish['recipe_name']
                    })

    combined_data = {
        "flight": flight_info_data,
        "cabin_crew": cabin_crew_data,
        "flight_crew": flight_crew_data,
        "passengers": passengers_data,
        "menu": menu_data
    }

    return combined_data

def convert_to_mysql_datetime(iso_datetime):
    try:
        dt = datetime.strptime(iso_datetime, "%Y-%m-%dT%H:%M:%SZ")
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise Exception(f"Invalid datetime format: {iso_datetime}")

def create_mysql_dump(flight_number):
    combined_data = get_combined_data(flight_number)
    flight_info_data = combined_data['flight']
    cabin_crew_data = combined_data['cabin_crew']
    flight_crew_data = combined_data['flight_crew']
    passengers_data = combined_data['passengers']

    # Convert flight_date to MySQL datetime format
    flight_date_mysql = convert_to_mysql_datetime(flight_info_data['flight_date'])

    sql_statements = []

    # Generate SQL statements for vehicle type
    vehicle_type = flight_info_data['vehicle_type']
    sql_statements.append(f"INSERT INTO vehicle_type (id, vehicle_type, number_of_seats, seating_plan, crew_limit, passenger_limit) VALUES ({vehicle_type['id']}, '{vehicle_type['vehicle_type']}', {vehicle_type['number_of_seats']}, '{vehicle_type['seating_plan']}', {vehicle_type['crew_limit']}, {vehicle_type['passenger_limit']});")

    # Generate SQL statements for flight
    sql_statements.append(f"INSERT INTO flights (flight_number, flight_date, flight_duration, flight_distance, source_country, source_city, source_airport_name, source_airport_code, destination_country, destination_city, destination_airport_name, destination_airport_code, vehicle_type_id, shared_flight) VALUES ('{flight_info_data['flight_number']}', '{flight_date_mysql}', '{flight_info_data['flight_duration']}', {flight_info_data['flight_distance']}, '{flight_info_data['source_country']}', '{flight_info_data['source_city']}', '{flight_info_data['source_airport_name']}', '{flight_info_data['source_airport_code']}', '{flight_info_data['destination_country']}', '{flight_info_data['destination_city']}', '{flight_info_data['destination_airport_name']}', '{flight_info_data['destination_airport_code']}', {vehicle_type['id']}, {flight_info_data['shared_flight']});")

    # Generate SQL statements for cabin crew
    for crew in cabin_crew_data:
        sql_statements.append(f"INSERT INTO cabin_crew (attendant_id, name, age, gender, nationality, known_languages, attendant_type, vehicle_restrictions) VALUES ({crew['attendant_id']}, '{crew['name']}', {crew['age']}, '{crew['gender']}', '{crew['nationality']}', '{crew['known_languages']}', '{crew['attendant_type']}', '{crew['vehicle_restrictions']}');")

        # Generate SQL statements for menu items if the crew member is a chef
        if crew['attendant_type'] == 'chef':
            for dish in crew['dish_recipes']:
                sql_statements.append(f"INSERT INTO menu (id, recipe_name, flight_number) VALUES ({dish['id']}, '{dish['recipe_name']}', '{flight_number}');")

    # Generate SQL statements for flight crew
    for crew in flight_crew_data:
        sql_statements.append(f"INSERT INTO flight_crew (pilot_id, name, age, gender, nationality, known_languages, vehicle_restriction, allowed_range, seniority_level) VALUES ({crew['pilot_id']}, '{crew['name']}', {crew['age']}, '{crew['gender']}', '{crew['nationality']}', '{crew['known_languages']}', '{crew['vehicle_restriction']}', {crew['allowed_range']}, '{crew['seniority_level']}');")

    # Generate SQL statements for passengers
    for passenger in passengers_data:
        sql_statements.append(f"INSERT INTO passengers (passenger_id, passenger_name, age, gender, nationality, seat_type, seat_number) VALUES ({passenger['passenger_id']}, '{passenger['passenger_name']}', {passenger['age']}, '{passenger['gender']}', '{passenger['nationality']}', '{passenger['seat_type']}', '{passenger['seat_number']}');")

        # Generate SQL statements for passenger children
        for child in passenger.get('children', []):
            sql_statements.append(f"INSERT INTO passenger_children (child_id, child_name, age, gender, nationality, parent_id) VALUES ({child['child_id']}, '{child['child_name']}', {child['age']}, '{child['gender']}', '{child['nationality']}', {passenger['passenger_id']});")

    return "\n".join(sql_statements)

# Function to create MongoDB dump
def create_mongodb_dump(flight_number):
    combined_data = get_combined_data(flight_number)
    
    # Convert combined data into the format suitable for MongoDB
    mongodb_data = [
        {"collection": "flights", "data": combined_data['flight']},
        {"collection": "cabin_crew", "data": combined_data['cabin_crew']},
        {"collection": "flight_crew", "data": combined_data['flight_crew']},
        {"collection": "passengers", "data": combined_data['passengers']},
        {"collection": "menu", "data": combined_data['menu']}
    ]
    
    return json.dumps(mongodb_data, indent=4)

class ExportRosterToMySQL(View):
    def get(self, request, flight_number):
        sql_dump = create_mysql_dump(flight_number)
        response = HttpResponse(sql_dump, content_type='application/sql')
        response['Content-Disposition'] = f'attachment; filename="roster_{flight_number}.sql"'
        return response

class ExportRosterToMongoDB(View):
    def get(self, request, flight_number):
        mongodb_dump = create_mongodb_dump(flight_number)
        response = HttpResponse(mongodb_dump, content_type='application/json')
        response['Content-Disposition'] = f'attachment; filename="roster_{flight_number}.json"'
        return response

class ExportRosterToJSON(View):
    def get(self, request, flight_number):
        combined_data = get_combined_data(flight_number)
        json_data = json.dumps(combined_data, indent=4)
        response = HttpResponse(json_data, content_type='application/json')
        response['Content-Disposition'] = f'attachment; filename="roster_{flight_number}.json"'
        return response


