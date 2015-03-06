from django.core.urlresolvers import resolve, Resolver404
from django.conf import settings


def section(request):

    sections = getattr(settings, 'ANIMA_SECTIONS', [])
    if not sections:
        return {}

    try:
        url = resolve(request.path).url_name
        for section in sections:
            if url in section['urls']:
                return {
                    'section': section
                }
    except Resolver404:
        pass

    return {
        'section': None
    }
