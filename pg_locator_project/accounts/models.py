from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        TENANT = 'tenant', _('Tenant')
        OWNER = 'owner', _('Owner')
        ADMIN = 'admin', _('Admin')

    role = models.CharField(
        max_length=10, 
        choices=RoleChoices.choices, 
        default=RoleChoices.TENANT,
        verbose_name=_('Role'),
        help_text=_('Select the role for the user.')
    )

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
