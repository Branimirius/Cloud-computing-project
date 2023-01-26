from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.professor_registration, name='professor-registration'),
    path('', views.professor_table, name='professor-table')
]
