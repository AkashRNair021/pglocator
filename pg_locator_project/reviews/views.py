from django.views.generic import CreateView, UpdateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from .models import Review

@method_decorator(login_required, name='dispatch')
class ReviewCreateView(CreateView):
    model = Review
    fields = ['rating', 'comment']
    # We will implement form_valid logic later to attach the PG based on the URL
    
    def get_success_url(self):
        # Placeholder, will redirect to PG details
        return reverse_lazy('core:home')

@method_decorator(login_required, name='dispatch')
class ReviewUpdateView(UpdateView):
    model = Review
    fields = ['rating', 'comment']
    
    def get_success_url(self):
        # Placeholder, will redirect to PG details
        return reverse_lazy('core:home')

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
