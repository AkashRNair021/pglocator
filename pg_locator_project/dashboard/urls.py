from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('owner/', views.OwnerDashboardView.as_view(), name='owner_dashboard'),
    path('admin/', views.AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/listings/', views.AdminListingsView.as_view(), name='admin_listings'),
    path('admin/listings/<int:pk>/toggle/', views.ToggleApprovalView.as_view(), name='toggle_approval'),
    path('admin/users/', views.AdminUsersView.as_view(), name='admin_users'),
]
