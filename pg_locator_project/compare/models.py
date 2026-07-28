from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from pgs.models import PGListing

class CompareList(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='compare_list',
        verbose_name=_('User')
    )
    pg = models.ForeignKey(
        PGListing, 
        on_delete=models.CASCADE, 
        related_name='compared_by',
        verbose_name=_('PG Listing')
    )
    added_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Added At')
    )

    class Meta:
        verbose_name = _('Compare List Item')
        verbose_name_plural = _('Compare List Items')
        ordering = ['-added_at']
        unique_together = ('user', 'pg')

    def __str__(self):
        return f"{self.user.username} comparing {self.pg.name}"
