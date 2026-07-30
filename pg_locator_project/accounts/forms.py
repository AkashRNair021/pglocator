from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from owners.models import OwnerProfile
from pg_locator_project.validators import validate_password_strength, validate_phone_number

User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    phone_number = forms.CharField(max_length=20, required=False, help_text="Required if registering as an Owner.")
    
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'role')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # We don't want users to register as admins from the public form
        self.fields['role'].choices = [
            choice for choice in User.RoleChoices.choices if choice[0] != User.RoleChoices.ADMIN
        ]
        self.fields['email'].required = True

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("A user with that email already exists.")
        return email

    def clean_phone_number(self):
        role = self.cleaned_data.get('role')
        phone = self.cleaned_data.get('phone_number')
        
        if role == User.RoleChoices.OWNER:
            if not phone:
                raise ValidationError("Phone number is required for property owners.")
            validate_phone_number(phone)
            if OwnerProfile.objects.filter(phone_number=phone).exists():
                raise ValidationError("A user with that phone number already exists.")
        return phone
        
    def clean_password1(self):
        password = self.cleaned_data.get("password1")
        if password:
            validate_password_strength(password)
        return super().clean_password1()

class CustomAuthenticationForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Username'})
        self.fields['password'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Password'})
