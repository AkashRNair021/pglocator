from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from django.views.generic import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from .models import Review
from .forms import ReviewForm
from pgs.models import PGListing

class ReviewCreateView(LoginRequiredMixin, CreateView):
    model = Review
    form_class = ReviewForm
    
    def dispatch(self, request, *args, **kwargs):
        self.pg = get_object_or_404(PGListing, slug=self.kwargs['pg_slug'])
        # Prevent owners from reviewing their own PG
        if hasattr(request.user, 'owner_profile') and self.pg.owner == request.user.owner_profile:
            messages.error(request, "You cannot review your own property.")
            return redirect('pgs:detail', slug=self.pg.slug)
        # Prevent multiple reviews from the same user
        if Review.objects.filter(user=request.user, pg=self.pg).exists():
            messages.error(request, "You have already reviewed this property.")
            return redirect('pgs:detail', slug=self.pg.slug)
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        form.instance.user = self.request.user
        form.instance.pg = self.pg
        messages.success(self.request, "Review submitted successfully.")
        return super().form_valid(form)

    def form_invalid(self, form):
        messages.error(self.request, "Error submitting review. Please check the form.")
        return redirect('pgs:detail', slug=self.pg.slug)

    def get_success_url(self):
        return reverse('pgs:detail', kwargs={'slug': self.pg.slug})

class ReviewUpdateView(LoginRequiredMixin, UpdateView):
    model = Review
    form_class = ReviewForm
    
    def dispatch(self, request, *args, **kwargs):
        review = self.get_object()
        if review.user != request.user:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        messages.success(self.request, "Review updated successfully.")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse('pgs:detail', kwargs={'slug': self.object.pg.slug})

class ReviewDeleteView(LoginRequiredMixin, DeleteView):
    model = Review
    
    def dispatch(self, request, *args, **kwargs):
        review = self.get_object()
        if review.user != request.user:
            raise PermissionDenied
        return super().dispatch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "Review deleted successfully.")
        return super().delete(request, *args, **kwargs)

    def get_success_url(self):
        return reverse('pgs:detail', kwargs={'slug': self.object.pg.slug})
