from django.views.generic import TemplateView, ListView, View
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from accounts.decorators import owner_required, admin_required
from pgs.models import PGListing
from accounts.models import User

from reviews.models import Review
from django.db.models import Sum, F, Avg

@method_decorator(owner_required, name='dispatch')
class OwnerDashboardView(TemplateView):
    template_name = 'owner-dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Base queries
        pgs = PGListing.objects.filter(owner=self.request.user.owner_profile).prefetch_related('rooms')
        reviews = Review.objects.filter(pg__owner=self.request.user.owner_profile).select_related('user', 'pg')
        
        # Calculate Room Metrics
        total_beds = 0
        vacant_beds = 0
        demo_revenue = 0
        
        for pg in pgs:
            for room in pg.rooms.all():
                total_beds += room.total_beds
                vacant_beds += room.available_beds
                
                occupied = room.total_beds - room.available_beds
                if occupied > 0:
                    demo_revenue += occupied * room.price_per_month
                    
        occupied_beds = total_beds - vacant_beds
        
        # Calculate Review Metrics
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] or 0.0
        total_reviews = reviews.count()
        recent_activity = reviews.order_by('-created_at')[:5]

        # Populate context
        context['pgs'] = pgs
        context['total_listings'] = pgs.count()
        context['pending_approval'] = pgs.filter(is_approved=False).count()
        
        context['total_beds'] = total_beds
        context['vacant_beds'] = vacant_beds
        context['occupied_beds'] = occupied_beds
        context['demo_revenue'] = demo_revenue
        
        context['total_reviews'] = total_reviews
        context['avg_rating'] = round(avg_rating, 1)
        context['recent_activity'] = recent_activity
        
        return context

from owners.models import OwnerProfile
from moderation.models import ActivityLog
from django.db.models.functions import TruncMonth
from django.db.models import Count
import json

@method_decorator(admin_required, name='dispatch')
class AdminDashboardView(TemplateView):
    template_name = 'admin-dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # 1. Global Metrics
        context['total_users'] = User.objects.filter(is_owner=False, is_superuser=False).count()
        context['total_owners'] = OwnerProfile.objects.count()
        context['total_pgs'] = PGListing.objects.count()
        context['pending_pgs'] = PGListing.objects.filter(is_approved=False).count()
        context['total_reviews'] = Review.objects.count()
        
        # 2. Charts Data
        
        # Monthly Registrations (Last 8 months as an example)
        # Using TruncMonth on date_joined
        monthly_counts = (
            User.objects.annotate(month=TruncMonth('date_joined'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        
        # Format for Chart.js
        months = []
        user_counts = []
        for entry in monthly_counts:
            if entry['month']:
                months.append(entry['month'].strftime('%b %Y'))
                user_counts.append(entry['count'])
        
        # If no users yet, provide fallback
        if not months:
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
            user_counts = [0] * 8
            
        context['chart_months'] = json.dumps(months[-8:]) # Last 8 items
        context['chart_users'] = json.dumps(user_counts[-8:])
        
        # Ratings Distribution (1 to 5 stars)
        rating_counts = list(Review.objects.values('rating').annotate(count=Count('id')).order_by('rating'))
        
        # Categories: Students, Professionals, Owners 
        # (Assuming we map user roles. If we only have owner/seeker, we use that)
        # We'll just show Seekers vs Owners vs Admins
        context['chart_category_labels'] = json.dumps(['Seekers', 'Owners', 'Admins'])
        context['chart_category_data'] = json.dumps([
            context['total_users'],
            context['total_owners'],
            User.objects.filter(is_superuser=True).count()
        ])
        
        # 3. Recent Activities
        context['latest_listings'] = PGListing.objects.select_related('owner', 'owner__user').prefetch_related('rooms').order_by('-created_at')[:5]
        context['recent_users'] = User.objects.order_by('-date_joined')[:5]
        context['recent_activities'] = ActivityLog.objects.select_related('actor').order_by('-timestamp')[:10]
        
        return context

@method_decorator(admin_required, name='dispatch')
class AdminListingsView(ListView):
    model = PGListing
    template_name = 'admin-listings.html'
    context_object_name = 'pgs'
    paginate_by = 20
    
    def get_queryset(self):
        return PGListing.objects.select_related('owner', 'owner__user').prefetch_related('images').order_by('is_approved', '-created_at')

@method_decorator(admin_required, name='dispatch')
class ToggleApprovalView(View):
    def post(self, request, pk, *args, **kwargs):
        pg = get_object_or_404(PGListing, pk=pk)
        pg.is_approved = not pg.is_approved
        pg.save()
        status = "approved" if pg.is_approved else "unapproved"
        action_type = "APPROVE_PG" if pg.is_approved else "REJECT_PG"
        
        from moderation.models import ActivityLog
        ActivityLog.objects.create(
            actor=request.user,
            action_type=action_type,
            target_object_repr=f"PGListing: {pg.name} (ID: {pg.id})"
        )
        
        messages.success(request, f"PG '{pg.name}' has been {status}.")
        return redirect('dashboard:admin_listings')

@method_decorator(admin_required, name='dispatch')
class AdminUsersView(ListView):
    model = User
    template_name = 'admin-users.html'
    context_object_name = 'users'
    paginate_by = 20
    
    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')
