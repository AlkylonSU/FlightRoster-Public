from django.urls import path
from .views import FlightCrewList, FlightCrewCreate, FlightCrewUpdate, FlightCrewDelete

urlpatterns = [
    path('all/', FlightCrewList.as_view(), name='flight-crew-list'),
    path('create/', FlightCrewCreate.as_view(), name='flight-crew-create'),
    path('update/<int:pk>/', FlightCrewUpdate.as_view(), name='flight-crew-update'),
    path('delete/<int:pk>/', FlightCrewDelete.as_view(), name='flight-crew-delete'),
]
