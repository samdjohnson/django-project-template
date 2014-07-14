import json

from django.core.exceptions import ValidationError

def valid_json(txt):
    try:
        json.loads(txt)
    except:
        raise ValidationError("Invalid JSON")