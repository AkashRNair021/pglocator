from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from pgs.models import PGListing

class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='reviews',
        verbose_name=_('User')
    )
    pg = models.ForeignKey(
        PGListing, 
        on_delete=models.CASCADE, 
        related_name='reviews',
        verbose_name=_('PG Listing')
    )
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text=_("Rating from 1 to 5"),
        verbose_name=_('Rating')
    )
    comment = models.TextField(
        verbose_name=_('Comment')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Updated At')
    )

    class Meta:
        verbose_name = _('Review')
        verbose_name_plural = _('Reviews')
        ordering = ['-created_at']
        unique_together = ('user', 'pg')

    def __str__(self):
        return f"Review by {self.user.username} for {self.pg.name}"
