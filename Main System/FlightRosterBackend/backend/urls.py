from django.urls import path
from .views import LoginView, FetchAndAssignCrew, FetchAssignedCrew
from .views import ExportRosterToMongoDB, ExportRosterToJSON, ExportRosterToMySQL

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('fetch-and-assign-crew/<str:flight_number>/', FetchAndAssignCrew.as_view(), name='fetch-and-assign-crew'),
    path('assigned-crew/<str:flight_number>/', FetchAssignedCrew.as_view(), name='assigned-crew'),
    path('export/mongodb/<str:flight_number>/', ExportRosterToMongoDB.as_view(), name='export-roster-mongodb'),
    path('export/json/<str:flight_number>/', ExportRosterToJSON.as_view(), name='export-roster-json'),
     path('export/mysql/<str:flight_number>/', ExportRosterToMySQL.as_view(), name='export-roster-mysql'),
]
