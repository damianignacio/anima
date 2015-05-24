import django.dispatch


pre_delete = django.dispatch.Signal(providing_args=['url'])
post_delete = django.dispatch.Signal(providing_args=['url'])
