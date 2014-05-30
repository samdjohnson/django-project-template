import re
import string
from urllib import urlencode
import urlparse

from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()

@register.filter
@stringfilter
def deslugify(value):
    value = re.sub('-', ' ', value)
    return string.capwords(value, ' ')

@register.filter
def page_list(page_obj):
    num_pages = page_obj.paginator.num_pages
    current_page = page_obj.number
    start_index = (current_page - 8) if (current_page - 8 > 0) else 0
    end_index = (current_page + 8) if (current_page + 8 <= num_pages) else num_pages

    return page_obj.paginator.page_range[start_index:end_index]

@register.filter
def coma_sep_thousands(value):
    try:
        return '{:,}'.format(value)
    except ValueError:
        return value

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.simple_tag
def url_replace(current_qs, field, value):
    dict_ = {k: v[0] for k, v in urlparse.parse_qs(current_qs).iteritems()}
    dict_[field] = value
    return urlencode(dict_)