from django.conf.urls import url, include
from django.http import HttpResponse
from django.template import RequestContext, Template


def section(request):
    t = Template('{{ section.slug }} {{ section.name }}')
    c = RequestContext(request, {})
    return HttpResponse(t.render(c))


# Without namespace

urlpatterns = [
    url(r'^section1/$', section, name='section1-url'),
    url(r'^section2/$', section, name='section2-url'),
    url(r'^section2-1/$', section, name='section2.1-url'),
    url(r'^section4/$', section, name='section4-url'),
]


# With namespace
ns = type('ns', (), {
    'urlpatterns': [
        url(r'^section5/$', section, name='section5-url'),
    ]
})

urlpatterns = urlpatterns + [
    url(r'^', include(ns, namespace='ns')),
]
