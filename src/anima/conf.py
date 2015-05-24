from django.conf import settings as django_settings
from django.utils.functional import LazyObject


defaults = {
    'SECTIONS': [],
    'FILE_BROWSER': {
        's3': {
            'bucket': None,
            'bucket_path': None,
            'bucket_url': None,
            'access_key_id': None,
            'secret_access_key': None,
        },
    }
}


def SettingsHolder(anima_settings):
    anima = defaults.copy()
    anima.update(anima_settings)
    return type('Settings', (object, ), anima)


class LazySettings(LazyObject):

    def _setup(self):
        anima_settings = getattr(django_settings, 'ANIMA', {})
        self._wrapped = SettingsHolder(anima_settings)

anima_settings = LazySettings()

# Cannot instatiate anymore
del LazySettings
