from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import CreateView, UpdateView, DeleteView, View
from django.utils.decorators import method_decorator
from django.urls import reverse_lazy
from django.contrib import messages
from accounts.decorators import owner_required
from pgs.models import PGListing, Room, PGImage
from .forms import PGListingForm, RoomForm, PGImageUploadForm

@method_decorator(owner_required, name='dispatch')
class PGCreateView(CreateView):
    model = PGListing
    form_class = PGListingForm
    template_name = 'owner-add-pg.html'
    success_url = reverse_lazy('dashboard:owner_dashboard')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['room_form'] = RoomForm(self.request.POST)
            context['image_form'] = PGImageUploadForm(self.request.POST, self.request.FILES)
        else:
            context['room_form'] = RoomForm()
            context['image_form'] = PGImageUploadForm()
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        room_form = context['room_form']
        image_form = context['image_form']
        
        if form.is_valid() and room_form.is_valid():
            # Save PG Listing
            self.object = form.save(commit=False)
            self.object.owner = self.request.user.owner_profile
            self.object.is_approved = False # Requires admin approval
            self.object.save()
            form.save_m2m() # For amenities
            
            # Save Room
            room = room_form.save(commit=False)
            room.pg = self.object
            room.save()
            
            # Save Images
            files = self.request.FILES.getlist('images')
            for i, f in enumerate(files):
                PGImage.objects.create(
                    pg=self.object,
                    image=f,
                    is_primary=(i == 0) # First image is primary
                )
            
            messages.success(self.request, "Property listed successfully! It is pending admin approval.")
            return redirect(self.success_url)
        else:
            return self.render_to_response(self.get_context_data(form=form))

@method_decorator(owner_required, name='dispatch')
class PGUpdateView(UpdateView):
    model = PGListing
    form_class = PGListingForm
    template_name = 'owner-edit-pg.html'
    success_url = reverse_lazy('dashboard:owner_dashboard')

    def get_queryset(self):
        return PGListing.objects.filter(owner=self.request.user.owner_profile)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            # We assume the user can only update the first room for simplicity in this combined form
            room_instance = self.object.rooms.first()
            context['room_form'] = RoomForm(self.request.POST, instance=room_instance)
            context['image_form'] = PGImageUploadForm(self.request.POST, self.request.FILES)
        else:
            room_instance = self.object.rooms.first()
            context['room_form'] = RoomForm(instance=room_instance)
            context['image_form'] = PGImageUploadForm()
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        room_form = context['room_form']
        
        if form.is_valid() and room_form.is_valid():
            self.object = form.save()
            room_form.save()
            
            # Append new images if provided
            files = self.request.FILES.getlist('images')
            for f in files:
                has_primary = self.object.images.filter(is_primary=True).exists()
                PGImage.objects.create(
                    pg=self.object,
                    image=f,
                    is_primary=not has_primary
                )
                
            messages.success(self.request, "Property updated successfully.")
            return redirect(self.success_url)
        else:
            return self.render_to_response(self.get_context_data(form=form))

@method_decorator(owner_required, name='dispatch')
class PGDeleteView(DeleteView):
    model = PGListing
    success_url = reverse_lazy('dashboard:owner_dashboard')
    
    def get_queryset(self):
        return PGListing.objects.filter(owner=self.request.user.owner_profile)
    
    def delete(self, request, *args, **kwargs):
        messages.success(self.request, "Property deleted successfully.")
        return super().delete(request, *args, **kwargs)

from django.http import JsonResponse

@method_decorator(owner_required, name='dispatch')
class DeleteImageView(View):
    def post(self, request, pk, *args, **kwargs):
        # Ensure the image belongs to a PG owned by this user
        image = get_object_or_404(PGImage, pk=pk, pg__owner=request.user.owner_profile)
        image.delete() # Django's FileField delete method will also remove the file from storage if configured properly (or django-cleanup app is used)
        return JsonResponse({'success': True, 'message': 'Image deleted'})

@method_decorator(owner_required, name='dispatch')
class SetPrimaryImageView(View):
    def post(self, request, pk, *args, **kwargs):
        image = get_object_or_404(PGImage, pk=pk, pg__owner=request.user.owner_profile)
        
        # Unset all other images for this PG
        PGImage.objects.filter(pg=image.pg).update(is_primary=False)
        
        # Set this one to primary
        image.is_primary = True
        image.save()
        
        return JsonResponse({'success': True, 'message': 'Image set as primary'})
