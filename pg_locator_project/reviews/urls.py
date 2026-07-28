from django.urls import path
from django.http import HttpResponse
from . import views

# Placeholder for delete action
def dummy_delete(request, **kwargs):
    return HttpResponse("Delete review not implemented yet.")

app_name = 'reviews'

urlpatterns = [
    path('add/<slug:slug>/', views.ReviewCreateView.as_view(), name='add_review'),
    path('edit/<int:pk>/', views.ReviewUpdateView.as_view(), name='edit_review'),
    path('delete/<int:pk>/', dummy_delete, name='delete_review'),
]
