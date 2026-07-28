from django.urls import path
from django.http import HttpResponse
from . import views

# Placeholders for add/remove actions which require logic later
def dummy_add(request, **kwargs):
    return HttpResponse("Add to compare not implemented yet.")

def dummy_remove(request, **kwargs):
    return HttpResponse("Remove from compare not implemented yet.")

app_name = 'compare'

urlpatterns = [
    path('', views.CompareListView.as_view(), name='list'),
    path('add/<slug:slug>/', dummy_add, name='add_to_compare'),
    path('remove/<slug:slug>/', dummy_remove, name='remove_from_compare'),
]
