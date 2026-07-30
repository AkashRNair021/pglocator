from django.views.generic import ListView, View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Favorite
from pgs.models import PGListing

@method_decorator(login_required, name='dispatch')
class FavoriteListView(ListView):
    model = Favorite
    template_name = 'favorites.html'
    context_object_name = 'favorites'

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('pg').prefetch_related('pg__images', 'pg__amenities', 'pg__rooms')

class ToggleFavoriteView(View):
    def post(self, request, pg_id, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        pg = get_object_or_404(PGListing, pk=pg_id)
        
        # Check if favorite already exists
        favorite, created = Favorite.objects.get_or_create(user=request.user, pg=pg)
        
        if not created:
            # If it already existed, user wants to remove it
            favorite.delete()
            status = 'removed'
        else:
            status = 'added'
            
        # Get new count
        count = Favorite.objects.filter(user=request.user).count()
        
        return JsonResponse({
            'status': status,
            'count': count
        })
