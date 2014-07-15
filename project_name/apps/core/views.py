import json

from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, Http404
from django.views.generic import View

def _json_response(context):
    return HttpResponse(json.dumps(context), mimetype="application/json")

class LoginRequiredView(View):
    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(LoginRequiredView, self).dispatch(request, *args, **kwargs)

class LoginTemplateView(LoginRequiredView, TemplateView):
    pass

class StaffMemberRequiredView(View):
    @method_decorator(staff_member_required)
    def dispatch(self, request, *args, **kwargs):
        return super(StaffMemberRequiredView, self).dispatch(request, *args, **kwargs)

class StaffTemplateView(StaffMemberRequiredView, TemplateView):
    pass

class AJAXUpdateView(DetailView):
    def get(self, request, *args, **kwargs):
        json_obj = serializers.serialize('json', [self.get_object(), ])
        return HttpResponse(json_obj, mimetype="application/json")

    def post(self, request, *args, **kwargs):
        self._update_object(request.POST)
        return self.render_to_response({"success": "It worked!"})

    def render_to_response(self, context, **response_kwargs):
        return HttpResponse(json.dumps(context), mimetype="application/json")

    def _update_object(self, post):
        print post
        print self.model._meta.fields
        obj = self.get_object()
        for field in self.model._meta.fields:
            if post.get(field.name):
                val = field.get_prep_value(post.get(field.name))
                setattr(obj, field.get_attname(), val)
        obj.save()
