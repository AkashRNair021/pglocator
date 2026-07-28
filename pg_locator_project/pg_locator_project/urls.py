from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    
    # Core app routing
    path('pgs/', include('pgs.urls', namespace='pgs')),
    path('owner/', include('owners.urls', namespace='owners')),
    path('dashboard/', include('dashboard.urls', namespace='dashboard')),
    path('reviews/', include('reviews.urls', namespace='reviews')),
    path('favorites/', include('favorites.urls', namespace='favorites')),
    path('compare/', include('compare.urls', namespace='compare')),

    # Core app for static pages (Home, About, Contact, FAQ)
    path('', include('core.urls', namespace='core')),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
