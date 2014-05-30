from django.db import models

class Created(models.Model):
    created = models.DateField(auto_now_add=True)
    modified = models.DateField(auto_now=True)

    class Meta:
        abstract = True