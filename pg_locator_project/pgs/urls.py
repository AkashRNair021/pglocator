from django.urls import path
from . import views

app_name = 'pgs'

urlpatterns = [
    path('', views.PGListView.as_view(), name='list'),
    path('<slug:slug>/', views.PGDetailView.as_view(), name='detail'),
]
