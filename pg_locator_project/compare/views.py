from django.views.generic import ListView, View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import CompareList
from pgs.models import PGListing

@method_decorator(login_required, name='dispatch')
class CompareListView(ListView):
    model = CompareList
    template_name = 'compare.html'
    context_object_name = 'compare_items'

    def get_queryset(self):
        return CompareList.objects.filter(user=self.request.user).select_related(
            'pg', 'pg__owner', 'pg__owner__user'
        ).prefetch_related('pg__images', 'pg__amenities', 'pg__rooms', 'pg__reviews')

class ToggleCompareView(View):
    def post(self, request, pg_id, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
            
        pg = get_object_or_404(PGListing, pk=pg_id)
        
        # Check if compare item already exists
        compare_item = CompareList.objects.filter(user=request.user, pg=pg).first()
        
        if compare_item:
            # If it already existed, user wants to remove it
            compare_item.delete()
            status = 'removed'
        else:
            # Check limit
            current_count = CompareList.objects.filter(user=request.user).count()
            if current_count >= 3:
                return JsonResponse({'error': 'You can only compare up to 3 properties at a time.'}, status=400)
                
            CompareList.objects.create(user=request.user, pg=pg)
            status = 'added'
            
        # Get new count
        count = CompareList.objects.filter(user=request.user).count()
        
        return JsonResponse({
            'status': status,
            'count': count
        })
