from django.views.generic import ListView, DetailView
from .models import PGListing

class PGListView(ListView):
    model = PGListing
    template_name = 'listings.html'
    context_object_name = 'pgs'
    
    def get_queryset(self):
        return PGListing.objects.filter(is_approved=True)
    
class PGDetailView(DetailView):
    model = PGListing
    template_name = 'property-details.html'
    context_object_name = 'pg'

    def get_queryset(self):
        return PGListing.objects.filter(is_approved=True)
