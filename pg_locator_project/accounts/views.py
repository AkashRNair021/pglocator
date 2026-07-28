from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.views.generic import CreateView
from django.urls import reverse_lazy
from django.db import transaction

from .forms import CustomUserCreationForm, CustomAuthenticationForm
from owners.models import OwnerProfile
from accounts.models import User

class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'accounts/login.html'

    def get_success_url(self):
        user = self.request.user
        if user.role == User.RoleChoices.ADMIN:
            return reverse_lazy('admin:index')
        elif user.role == User.RoleChoices.OWNER:
            return reverse_lazy('dashboard:owner_dashboard')
        else:
            return reverse_lazy('core:home')

class RegisterView(CreateView):
    form_class = CustomUserCreationForm
    template_name = 'accounts/register.html'

    @transaction.atomic
    def form_valid(self, form):
        user = form.save()
        # If the user registered as an owner, create their profile immediately
        if user.role == User.RoleChoices.OWNER:
            OwnerProfile.objects.create(user=user, phone_number=f"+0000000_{user.id}") # Temporary dummy phone to bypass validator for now
        
        login(self.request, user)
        
        if user.role == User.RoleChoices.OWNER:
            return redirect('dashboard:owner_dashboard')
        return redirect('core:home')
