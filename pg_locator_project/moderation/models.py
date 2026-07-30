from django.db import models
from django.conf import settings
from pgs.models import PGListing
from reviews.models import Review

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('APPROVE_PG', 'Approve PG'),
        ('REJECT_PG', 'Reject PG'),
        ('DELETE_PG', 'Delete PG'),
        ('SUSPEND_USER', 'Suspend User'),
        ('ACTIVATE_USER', 'Activate User'),
        ('DELETE_USER', 'Delete User'),
    ]
    
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='actions_logged')
    action_type = models.CharField(max_length=20, choices=ACTION_CHOICES)
    target_object_repr = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        
    def __str__(self):
        return f"{self.actor} - {self.get_action_type_display()} - {self.target_object_repr}"


class ReviewReport(models.Model):
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_submitted')
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='reports')
    reason = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['is_resolved', '-created_at']
        
    def __str__(self):
        return f"Report on Review {self.review.id} by {self.reporter}"
