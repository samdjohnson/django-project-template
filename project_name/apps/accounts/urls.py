from django.conf.urls import patterns, include, url
from django.contrib.auth.views import login, logout

from .views import UserProfileDetailView

urlpatterns = patterns('',
    url(r'^login/$', login, {'template_name': 'accounts/login.html'}),
    url(r'^logout/$', logout, {'template_name': 'accounts/logout.html'}),
    url(r'^profile/$', UserProfileDetailView.as_view()),
)