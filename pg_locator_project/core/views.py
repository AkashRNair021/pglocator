from django.views.generic import TemplateView
from django.db.models import Count, Avg
from pgs.models import PGListing
from accounts.models import User
from reviews.models import Review

class HomeView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Featured PGs (Highest rated or simply the first 3)
        # Assuming featured are those with best ratings for now
        context['featured_pgs'] = PGListing.objects.filter(is_approved=True).annotate(
            avg_rating=Avg('reviews__rating')
        ).order_by('-avg_rating')[:3]
        
        # Latest PGs
        context['latest_pgs'] = PGListing.objects.filter(is_approved=True).order_by('-created_at')[:3]

        # Popular Cities (Top 4 cities by count of PGs)
        context['popular_cities'] = PGListing.objects.filter(is_approved=True).values('city').annotate(
            pg_count=Count('id')
        ).order_by('-pg_count')[:4]

        # Testimonials (Top 3 reviews with 5 star rating)
        context['testimonials'] = Review.objects.filter(rating__gte=4).order_by('-created_at')[:3]

        # Statistics
        context['stats'] = {
            'total_tenants': User.objects.filter(role=User.RoleChoices.TENANT).count(),
            'total_pgs': PGListing.objects.count(),
            'total_cities': PGListing.objects.values('city').distinct().count(),
            'avg_rating': Review.objects.aggregate(avg=Avg('rating'))['avg'] or 0.0
        }

        return context

class AboutView(TemplateView):
    template_name = 'about.html'

class ContactView(TemplateView):
    template_name = 'contact.html'

class FAQView(TemplateView):
    template_name = 'faq.html'
