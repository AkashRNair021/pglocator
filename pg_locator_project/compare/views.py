from django.views.generic import ListView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import CompareList

@method_decorator(login_required, name='dispatch')
class CompareListView(ListView):
    model = CompareList
    template_name = 'compare.html'
    context_object_name = 'compare_items'

    def get_queryset(self):
        return CompareList.objects.filter(user=self.request.user)
