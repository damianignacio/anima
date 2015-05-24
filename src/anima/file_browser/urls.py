from django.conf.urls import url
from . import views


urlpatterns = [

    url(r'^file-browser/sign-upload/$',
        views.sign_upload,
        name='anima-file-browser-sign-upload'),

    url(r'^file-browser/delete/$',
        views.delete,
        name='anima-file-browser-delete'),
]
