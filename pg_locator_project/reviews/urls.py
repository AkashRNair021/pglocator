from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    path('pg/<slug:pg_slug>/add/', views.ReviewCreateView.as_view(), name='add_review'),
    path('<int:pk>/edit/', views.ReviewUpdateView.as_view(), name='edit_review'),
    path('<int:pk>/delete/', views.ReviewDeleteView.as_view(), name='delete_review'),
]
