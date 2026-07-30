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
from pg_locator_project.validators import validate_image_file

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

class PGImageUploadForm(forms.Form):
    images = forms.ImageField(widget=MultipleFileInput(attrs={'multiple': True}), required=False)

    def clean_images(self):
        files = self.files.getlist('images')
        for file in files:
            validate_image_file(file)
        return files
