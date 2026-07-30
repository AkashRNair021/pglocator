from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.views import View
from django.utils.decorators import method_decorator
from accounts.decorators import admin_required
from pgs.models import PGListing
from accounts.models import User
from moderation.models import ActivityLog, ReviewReport
from reviews.models import Review
from django.contrib.auth.decorators import login_required

@method_decorator(admin_required, name='dispatch')
class AdminDeletePGView(View):
    def post(self, request, pk, *args, **kwargs):
        pg = get_object_or_404(PGListing, pk=pk)
        pg_name = pg.name
        
        # Log before deleting
        ActivityLog.objects.create(
            actor=request.user,
            action_type='DELETE_PG',
            target_object_repr=f"PGListing: {pg_name} (ID: {pk})"
        )
        
        pg.delete()
        messages.success(request, f"PG '{pg_name}' has been deleted successfully.")
        return redirect('dashboard:admin_listings')

@method_decorator(admin_required, name='dispatch')
class ToggleUserSuspensionView(View):
    def post(self, request, pk, *args, **kwargs):
        user = get_object_or_404(User, pk=pk)
        
        # Cannot suspend superusers
        if user.is_superuser:
            messages.error(request, "Cannot suspend another admin.")
            return redirect('dashboard:admin_users')
            
        user.is_active = not user.is_active
        user.save()
        
        status = "activated" if user.is_active else "suspended"
        action_type = 'ACTIVATE_USER' if user.is_active else 'SUSPEND_USER'
        
        ActivityLog.objects.create(
            actor=request.user,
            action_type=action_type,
            target_object_repr=f"User: {user.username} (ID: {pk})"
        )
        
        messages.success(request, f"User '{user.username}' has been {status}.")
        return redirect('dashboard:admin_users')

@method_decorator(admin_required, name='dispatch')
class AdminDeleteUserView(View):
    def post(self, request, pk, *args, **kwargs):
        user = get_object_or_404(User, pk=pk)
        
        # Cannot delete superusers
        if user.is_superuser:
            messages.error(request, "Cannot delete another admin.")
            return redirect('dashboard:admin_users')
            
        username = user.username
        
        ActivityLog.objects.create(
            actor=request.user,
            action_type='DELETE_USER',
            target_object_repr=f"User: {username} (ID: {pk})"
        )
        
        user.delete()
        messages.success(request, f"User '{username}' has been deleted successfully.")
        return redirect('dashboard:admin_users')

@method_decorator(login_required, name='dispatch')
class ReportReviewView(View):
    def post(self, request, pk, *args, **kwargs):
        review = get_object_or_404(Review, pk=pk)
        reason = request.POST.get('reason', 'Inappropriate content')
        
        ReviewReport.objects.create(
            reporter=request.user,
            review=review,
            reason=reason
        )
        
        messages.success(request, "Review reported successfully. Our team will review it shortly.")
        # redirect back to wherever they came from
        return redirect(request.META.get('HTTP_REFERER', '/'))
