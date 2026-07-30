import re
from django.core.exceptions import ValidationError

def validate_password_strength(password):
    """
    Validates that a password meets minimum strength requirements:
    - At least 8 characters long
    - Contains at least one uppercase letter
    - Contains at least one number
    """
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long.")
    if not re.search(r'[A-Z]', password):
        raise ValidationError("Password must contain at least one uppercase letter.")
    if not re.search(r'\d', password):
        raise ValidationError("Password must contain at least one number.")

def validate_phone_number(phone):
    """
    Validates that a phone number format and length.
    It expects an optional + followed by digits, total length 9 to 15.
    """
    if not re.match(r'^\+?1?\d{9,15}$', phone):
        raise ValidationError("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

def validate_image_file(file):
    """
    Validates an uploaded image file:
    - Max size 5MB
    - Allowed extensions: .jpg, .jpeg, .png, .webp
    """
    # 5MB limit
    if file.size > 5 * 1024 * 1024:
        raise ValidationError(f"File {file.name} is larger than 5MB.")
    
    # Check extension
    if not file.name.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        raise ValidationError(f"File {file.name} is not a supported image type (JPG, PNG, WEBP).")
