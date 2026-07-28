from django.views.generic import ListView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import Favorite

@method_decorator(login_required, name='dispatch')
class FavoriteListView(ListView):
    model = Favorite
    template_name = 'favorites.html'
    context_object_name = 'favorites'

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
