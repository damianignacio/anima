import os
import sys


def run():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'anima.tests.settings')

    import django
    from django.test.utils import get_runner
    from django.conf import settings

    print('Django version: %s' % django.get_version())

    django.setup()

    TestRunner = get_runner(settings)
    test_runner = TestRunner(verbosity=1, interactive=True)
    failures = test_runner.run_tests(['anima.tests'])
    sys.exit(failures)
