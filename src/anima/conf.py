from django.conf import settings as django_settings
from django.utils.functional import LazyObject


defaults = {
    'SECTIONS': [],
}


def SettingsHolder(anima_settings):
    anima = defaults.copy()
    anima.update(anima_settings)
    return type('Settings', (), anima)


class LazySettings(LazyObject):

    def _setup(self):
        anima_settings = getattr(django_settings, 'ANIMA', {})
        self._wrapped = SettingsHolder(anima_settings)

settings = LazySettings()

# Cannot instatiate anymore
del LazySettings
