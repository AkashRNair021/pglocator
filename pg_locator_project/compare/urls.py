from django.urls import path
from . import views

app_name = 'compare'

urlpatterns = [
    path('', views.CompareListView.as_view(), name='list'),
    path('api/toggle/<int:pg_id>/', views.ToggleCompareView.as_view(), name='toggle'),
]
