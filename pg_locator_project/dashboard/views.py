from django.views.generic import TemplateView, ListView, View
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from accounts.decorators import owner_required, admin_required
from pgs.models import PGListing
from accounts.models import User

@method_decorator(owner_required, name='dispatch')
class OwnerDashboardView(TemplateView):
    template_name = 'owner-dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pgs'] = PGListing.objects.filter(owner=self.request.user.owner_profile)
        return context

@method_decorator(admin_required, name='dispatch')
class AdminDashboardView(TemplateView):
    template_name = 'admin-dashboard.html'

@method_decorator(admin_required, name='dispatch')
class AdminListingsView(ListView):
    model = PGListing
    template_name = 'admin-listings.html'
    context_object_name = 'pgs'
    
    def get_queryset(self):
        return PGListing.objects.all().order_by('is_approved', '-created_at')

@method_decorator(admin_required, name='dispatch')
class ToggleApprovalView(View):
    def post(self, request, pk, *args, **kwargs):
        pg = get_object_or_404(PGListing, pk=pk)
        pg.is_approved = not pg.is_approved
        pg.save()
        status = "approved" if pg.is_approved else "unapproved"
        messages.success(request, f"PG '{pg.name}' has been {status}.")
        return redirect('dashboard:admin_listings')

@method_decorator(admin_required, name='dispatch')
class AdminUsersView(ListView):
    model = User
    template_name = 'admin-users.html'
    context_object_name = 'users'
