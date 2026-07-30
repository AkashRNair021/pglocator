from django.views.generic import ListView, DetailView
from django.db.models import Q, Min
from .models import PGListing

class PGListView(ListView):
    model = PGListing
    template_name = 'listings.html'
    context_object_name = 'pgs'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = PGListing.objects.filter(is_approved=True, owner__user__is_active=True)
        
        # Get query params
        q = self.request.GET.get('q', '').strip()
        city = self.request.GET.get('city', '').strip()
        gender = self.request.GET.get('gender', '').strip()
        room_type = self.request.GET.get('room_type', '').strip()
        max_rent = self.request.GET.get('max_rent', '').strip()
        amenities = self.request.GET.getlist('amenities')
        available_only = self.request.GET.get('available_only', '')
        sort = self.request.GET.get('sort', 'popularity')

        # 1. Text Search
        if q:
            queryset = queryset.filter(
                Q(name__icontains=q) |
                Q(city__icontains=q) |
                Q(address__icontains=q) |
                Q(owner__user__first_name__icontains=q) |
                Q(owner__user__last_name__icontains=q)
            )

        # 2. City Filter
        if city:
            queryset = queryset.filter(city__iexact=city)

        # 3. Gender Filter
        if gender:
            queryset = queryset.filter(gender_type=gender)

        # 4. Room Type (Single=1, Shared>=2)
        if room_type:
            if room_type == 'single':
                queryset = queryset.filter(rooms__sharing_type=1)
            elif room_type == 'shared':
                queryset = queryset.filter(rooms__sharing_type__gte=2)

        # 5. Rent Max Filter
        if max_rent and max_rent.isdigit():
            queryset = queryset.filter(rooms__price_per_month__lte=int(max_rent))

        # 5b. Availability Filter
        if available_only == 'on':
            queryset = queryset.filter(rooms__available_beds__gt=0)

        # 6. Amenities Filter (Must have ALL selected amenities)
        for amenity in amenities:
            queryset = queryset.filter(amenities__name__iexact=amenity)

        # Optimize Queries
        queryset = queryset.select_related('owner', 'owner__user').prefetch_related('images', 'rooms', 'amenities').distinct()

        # 7. Sorting
        if sort == 'priceLow':
            queryset = queryset.annotate(min_price=Min('rooms__price_per_month')).order_by('min_price')
        elif sort == 'priceHigh':
            queryset = queryset.annotate(min_price=Min('rooms__price_per_month')).order_by('-min_price')
        elif sort == 'rating':
            from django.db.models import Avg
            queryset = queryset.annotate(avg_rating=Avg('reviews__rating')).order_by('-avg_rating')
        else: # popularity / default
            queryset = queryset.order_by('-created_at')

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Pass GET params to context to maintain filter state
        context['current_q'] = self.request.GET.get('q', '')
        context['current_city'] = self.request.GET.get('city', '')
        context['current_gender'] = self.request.GET.get('gender', '')
        context['current_room_type'] = self.request.GET.get('room_type', '')
        context['current_max_rent'] = self.request.GET.get('max_rent', '20000')
        context['current_amenities'] = self.request.GET.getlist('amenities')
        context['current_available_only'] = self.request.GET.get('available_only', '')
        context['current_sort'] = self.request.GET.get('sort', 'popularity')

        if self.request.user.is_authenticated:
            context['user_favorite_pg_ids'] = list(self.request.user.favorites.values_list('pg_id', flat=True))
            context['user_compare_pg_ids'] = list(self.request.user.compare_list.values_list('pg_id', flat=True))
        else:
            context['user_favorite_pg_ids'] = []
            context['user_compare_pg_ids'] = []
            
        # Create a query string without the page parameter for pagination links
        query_params = self.request.GET.copy()
        if 'page' in query_params:
            del query_params['page']
        context['query_string'] = query_params.urlencode()
            
        return context
    
class PGDetailView(DetailView):
    model = PGListing
    template_name = 'property-details.html'
    context_object_name = 'pg'

    def get_queryset(self):
        return PGListing.objects.filter(is_approved=True, owner__user__is_active=True)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        from reviews.forms import ReviewForm
        from reviews.models import Review
        
        # Check if the current user has already reviewed this PG
        user_has_reviewed = False
        user_favorite_pg_ids = []
        if self.request.user.is_authenticated:
            user_has_reviewed = Review.objects.filter(user=self.request.user, pg=self.object).exists()
            user_favorite_pg_ids = list(self.request.user.favorites.values_list('pg_id', flat=True))
            
        context['review_form'] = ReviewForm()
        context['user_has_reviewed'] = user_has_reviewed
        context['user_favorite_pg_ids'] = user_favorite_pg_ids
        return context
