A setup for Django running on Heroku, using a virtualenv and Postgres.App for local development.

Depends on:
- django


Usage:

```bash
cd <your_project>/

django-admin.py startproject <your_project> . --template='https://github.com/samdjohnson/django-project-template/archive/master.zip' --extension='py,wsgi'
pip install -r template_requirements.txt
foreman start
```
