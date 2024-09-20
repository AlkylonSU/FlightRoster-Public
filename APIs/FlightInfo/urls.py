from django.urls import path
from .views import FlightInfoView, AllFlightsView, FlightCreate, FlightUpdate, FlightDelete, FlightLocationsList, CreateFlightLocationView

urlpatterns = [
    path('all/', FlightInfoView.as_view(), name='flight-info'),
    path('all-flights/', AllFlightsView.as_view(), name='all-flights'),
    path('create/', FlightCreate.as_view(), name='flight-create'),
    path('update/<int:pk>/', FlightUpdate.as_view(), name='flight-update'),
    path('delete/<int:pk>/', FlightDelete.as_view(), name='flight-delete'),
    path('locations/', FlightLocationsList.as_view(), name='flight-locations'),
    path('locations/create/', CreateFlightLocationView.as_view(), name='create-flight-location'),
]
