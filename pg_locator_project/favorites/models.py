from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from pgs.models import PGListing

class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='favorites',
        verbose_name=_('User')
    )
    pg = models.ForeignKey(
        PGListing, 
        on_delete=models.CASCADE, 
        related_name='favorited_by',
        verbose_name=_('PG Listing')
    )
    added_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Added At')
    )

    class Meta:
        verbose_name = _('Favorite')
        verbose_name_plural = _('Favorites')
        ordering = ['-added_at']
        unique_together = ('user', 'pg')

    def __str__(self):
        return f"{self.user.username} favorited {self.pg.name}"
