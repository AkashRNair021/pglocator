from django.urls import path
from . import views

app_name = 'moderation'

urlpatterns = [
    path('pg/<int:pk>/delete/', views.AdminDeletePGView.as_view(), name='admin_delete_pg'),
    path('user/<int:pk>/suspend/', views.ToggleUserSuspensionView.as_view(), name='admin_suspend_user'),
    path('user/<int:pk>/delete/', views.AdminDeleteUserView.as_view(), name='admin_delete_user'),
    path('review/<int:pk>/report/', views.ReportReviewView.as_view(), name='report_review'),
]
