from django.urls import path
from . import views

app_name = 'favorites'

urlpatterns = [
    path('', views.FavoriteListView.as_view(), name='list'),
    path('api/toggle/<int:pg_id>/', views.ToggleFavoriteView.as_view(), name='toggle'),
]
