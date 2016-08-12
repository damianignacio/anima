from copy import deepcopy
from django.test import TestCase
from django.core.urlresolvers import reverse
from django.test import Client
from anima.utils import override_settings

from django import get_version

from distutils.version import LooseVersion

version = get_version()


overrides = {
    'ANIMA': {
        'SECTIONS': [
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
            {
                'name': 'Section #5',
                'slug': 'section5',
                'urls': ('ns:section5-url', )
            },
        ]
    }
}


if LooseVersion(version) < LooseVersion('1.8'):

    # Deprecated in django 1.8
    overrides['TEMPLATE_CONTEXT_PROCESSORS'] = (
        'anima.context_processors.section',
    )

else:
    overrides['TEMPLATES'] = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'anima.context_processors.section',
                ],
            },
        }
    ]


class ContextProcessorsTests(TestCase):

    def setUp(self):
        self.client = Client()

    def test_section(self):
        self.assertTrue(True)

        with override_settings(**overrides):
            response = self.client.get(reverse('section1-url'))
            self.assertContains(response, 'section1')
            self.assertContains(response, 'Section #1')

            response = self.client.get(reverse('section2-url'))
            self.assertContains(response, 'section2')
            self.assertContains(response, 'Section #2')

            response = self.client.get(reverse('ns:section5-url'))
            self.assertContains(response, 'section5')
            self.assertContains(response, 'Section #5')

    def test_section_empty(self):
        s = deepcopy(overrides)
        s['ANIMA'].pop('SECTIONS')
        with override_settings(**s):
            response = self.client.get(reverse('section1-url'))
            self.assertNotContains(response, 'section1')
            self.assertNotContains(response, 'Section #1')

        s = deepcopy(overrides)
        s['ANIMA']['SECTIONS'] = ()
        with override_settings(**s):
            response = self.client.get(reverse('section1-url'))
            self.assertNotContains(response, 'section1')
            self.assertNotContains(response, 'Section #1')

    def test_section_doesnt_match(self):

        with override_settings(**overrides):
            response = self.client.get(reverse('section4-url'))
            self.assertNotContains(response, 'section4')
            self.assertNotContains(response, 'Section #4')

    def test_section_multiple_urls(self):
        with override_settings(**overrides):
            response = self.client.get(reverse('section2-url'))
            from django.conf import settings
            self.assertContains(response, 'section2')
            self.assertContains(response, 'Section #2')

            response = self.client.get(reverse('section2.1-url'))
            self.assertContains(response, 'section2')
            self.assertContains(response, 'Section #2')
