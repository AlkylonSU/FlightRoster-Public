from django.urls import path
from .views import PassengersOnFlight, PassengerCreate, PassengerUpdate, PassengerDelete

urlpatterns = [
    path('flight/<str:flight_id>/', PassengersOnFlight.as_view(), name='passengers-on-flight'),
    path('create/', PassengerCreate.as_view(), name='passenger-create'),
    path('update/<int:pk>/', PassengerUpdate.as_view(), name='passenger-update'),
    path('delete/<int:pk>/', PassengerDelete.as_view(), name='passenger-delete'),
]
