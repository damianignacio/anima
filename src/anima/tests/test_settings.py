from django.test import TestCase
from anima.conf import anima_settings
from anima.utils import override_settings


class SettingsTests(TestCase):

    def test_default_settings(self):
        with override_settings(ANIMA={}):
            self.assertEquals([], anima_settings.SECTIONS)

    def test_sections_settings(self):
        sections = (
            {
                'name': 'Section #1',
                'slug': 'section1',
                'urls': ('section1-url', )
            },
            {
                'name': 'Section #2',
                'slug': 'section2',
                'urls': ('section2-url', 'section2.1-url', )
            },
        )

        with override_settings(ANIMA={'SECTIONS': sections}):
            self.assertEquals(sections, anima_settings.SECTIONS)

        self.assertEquals([], anima_settings.SECTIONS)
