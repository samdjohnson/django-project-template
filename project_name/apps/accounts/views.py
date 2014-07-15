from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.generic import DetailView

from .models import UserProfile

class UserProfileDetailView(DetailView):
    model = UserProfile
    template_name = "accounts/user-profile.html"
    context_object_name = "user_profile"

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(UserProfileDetailView, self).dispatch(*args, **kwargs)

    def get_object(self, queryset=None):
        return self.request.user.get_profile()