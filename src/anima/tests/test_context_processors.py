from copy import deepcopy
from django.test import TestCase
from django.core.urlresolvers import reverse
from django.test import Client
from anima.utils import override_settings

overrides = {
    'TEMPLATE_CONTEXT_PROCESSORS': (
        'anima.context_processors.section',
    ),
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
        ]
    }
}


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
            self.assertContains(response, 'section2')
            self.assertContains(response, 'Section #2')

            response = self.client.get(reverse('section2.1-url'))
            self.assertContains(response, 'section2')
            self.assertContains(response, 'Section #2')
