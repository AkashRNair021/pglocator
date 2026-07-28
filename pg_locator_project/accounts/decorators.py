from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.mixins import UserPassesTestMixin
from django.core.exceptions import PermissionDenied
from .models import User

def role_required(allowed_roles):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                from django.contrib.auth.views import redirect_to_login
                return redirect_to_login(request.get_full_path())
            if request.user.role in allowed_roles or request.user.is_superuser:
                return view_func(request, *args, **kwargs)
            raise PermissionDenied
        return _wrapped_view
    return decorator

tenant_required = role_required([User.RoleChoices.TENANT])
owner_required = role_required([User.RoleChoices.OWNER])
admin_required = role_required([User.RoleChoices.ADMIN])

class RoleRequiredMixin(UserPassesTestMixin):
    allowed_roles = []

    def test_func(self):
        return self.request.user.role in self.allowed_roles or self.request.user.is_superuser

class TenantRequiredMixin(RoleRequiredMixin):
    allowed_roles = [User.RoleChoices.TENANT]

class OwnerRequiredMixin(RoleRequiredMixin):
    allowed_roles = [User.RoleChoices.OWNER]

class AdminRequiredMixin(RoleRequiredMixin):
    allowed_roles = [User.RoleChoices.ADMIN]
