from django.test.utils import override_settings as django_override_settings
from anima.conf import SettingsHolder, settings


class override_settings(django_override_settings):

    def enable(self):
        if 'ANIMA' in self.options:
            self._anima_wrapped = settings._wrapped
            settings._wrapped = SettingsHolder(self.options['ANIMA'])
        super(override_settings, self).enable()

    def disable(self):
        if 'ANIMA' in self.options:
            settings._wrapped = self._anima_wrapped
        super(override_settings, self).disable()
