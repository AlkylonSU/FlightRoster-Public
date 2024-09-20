from django.urls import path
from .views import CabinCrewList, CabinCrewCreate, CabinCrewUpdate, CabinCrewDelete

urlpatterns = [
    path('all/', CabinCrewList.as_view(), name='cabin-crew-list'),
    path('create/', CabinCrewCreate.as_view(), name='cabin-crew-create'),
    path('update/<int:pk>/', CabinCrewUpdate.as_view(), name='cabin-crew-update'),
    path('delete/<int:pk>/', CabinCrewDelete.as_view(), name='cabin-crew-delete'),
]
