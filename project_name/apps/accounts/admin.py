from django.contrib import admin
from .models import UserProfile, Account

admin.site.register(Account)
admin.site.register(UserProfile)