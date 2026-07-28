from django.db import models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from accounts.models import User

class OwnerProfile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='owner_profile',
        verbose_name=_('User')
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$', 
        message=_("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    )
    phone_number = models.CharField(
        validators=[phone_regex], 
        max_length=20, 
        unique=True,
        verbose_name=_('Phone Number')
    )
    
    company_name = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        verbose_name=_('Company Name')
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name=_('Is Verified')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )

    class Meta:
        verbose_name = _('Owner Profile')
        verbose_name_plural = _('Owner Profiles')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}'s Profile"
