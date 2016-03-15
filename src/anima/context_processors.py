from django.core.urlresolvers import resolve, Resolver404
from anima.conf import anima_settings


def section(request):
    sections = anima_settings.SECTIONS
    if not sections:
        return {}

    try:
        url = resolve(request.path)

        if url.namespaces:
            urls = [
                ':'.join([ns, url.url_name]) for ns in url.namespaces
            ]
        else:
            urls = [url.url_name]

        for section in sections:
            if any([name in section['urls'] for name in urls]):
                return {
                    'section': section
                }
    except Resolver404:
        pass

    return {
        'section': None
    }
