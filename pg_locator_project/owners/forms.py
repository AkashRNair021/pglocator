from django import forms
from pgs.models import PGListing, Room, PGImage

class PGListingForm(forms.ModelForm):
    class Meta:
        model = PGListing
        fields = [
            'name', 'gender_type', 'city', 'address', 'state', 'zip_code', 
            'latitude', 'longitude', 'description', 'house_rules', 'amenities'
        ]
        widgets = {
            'amenities': forms.CheckboxSelectMultiple()
        }

class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = ['sharing_type', 'price_per_month', 'total_beds', 'available_beds', 'deposit_amount']

from django.core.exceptions import ValidationError

class PGImageUploadForm(forms.Form):
    images = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False)

    def clean_images(self):
        files = self.files.getlist('images')
        for file in files:
            # 5MB limit
            if file.size > 5 * 1024 * 1024:
                raise ValidationError(f"File {file.name} is larger than 5MB.")
            # Check extension
            if not file.name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                raise ValidationError(f"File {file.name} is not a supported image type (JPG, PNG, WEBP).")
        return files
