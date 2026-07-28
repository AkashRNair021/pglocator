from django.urls import path
from . import views

app_name = 'owners'

urlpatterns = [
    # path('profile/', views.ProfileUpdateView.as_view(), name='profile'), # Placeholder for later
    path('pgs/add/', views.PGCreateView.as_view(), name='add_pg'),
    path('pgs/<slug:slug>/edit/', views.PGUpdateView.as_view(), name='edit_pg'),
    path('pgs/<slug:slug>/delete/', views.PGDeleteView.as_view(), name='delete_pg'),
    
    # Image APIs
    path('images/<int:pk>/delete/', views.DeleteImageView.as_view(), name='delete_image'),
    path('images/<int:pk>/set-primary/', views.SetPrimaryImageView.as_view(), name='set_primary_image'),
]
