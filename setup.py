# -*- coding: utf-8 -*-
import sys
import os
import json
from setuptools import setup, Command
from setuptools.command.test import test as TestCommand


BOWER_JSON = json.dumps({
    "name": "anima",
    "dependencies": {
        "jquery": "~2.1",
        "bootstrap": "~3.3"
    }
})


PACKAGE_JSON = json.dumps({
    "name": "anima",
    "devDependencies": {
        "gulp": "^3.8.8",
        "bower-files": "^3.4.4"
    }
})


PKG_PATH = os.path.abspath(os.path.dirname(__file__))
SRC_PATH = os.path.join(PKG_PATH, 'src')
VER_PATH = os.path.join(PKG_PATH, 'src', 'anima', '__init__.py')
REQ_PATH = os.path.join(PKG_PATH, 'requirements.txt')
sys.path.append(SRC_PATH)


class Bower(Command):

    description = 'Update static files.'
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        assert not os.path.dirname(__file__), 'Must be in package root: %s' % (
            PKG_PATH
        )
        open('bower.json', 'wb').write(BOWER_JSON)
        open('package.json', 'wb').write(PACKAGE_JSON)
        os.system('rm -rf ./bower_components ./src/anima/static/anima/lib/')
        os.system('npm install')
        os.system('bower install')
        os.system('node_modules/.bin/gulp bower')
        os.system('rm -f bower.json package.json')


class Test(TestCommand):

    def run(self):
        import django
        from django.conf import settings
        from django.core.management import execute_from_command_line

        settings.configure(**{
            'DATABASES': {
                'default': {
                    'ENGINE': 'django.db.backends.sqlite3',
                },
            },
            'MIDDLEWARE_CLASSES': (),
        })
        django.setup()
        execute_from_command_line(['manage.py', 'test', 'anima.tests'])

anima = {}

with open(VER_PATH) as f:
    try:
        exec(f.read(), anima)
    except ImportError:
        pass

setup(
    name='anima',
    version=anima['__version__'],
    author=u'Damian Ignacio Valdés',
    author_email='damian.ignacio@gmail.com',
    include_package_data=True,
    url='https://github.com/damianignacio/anima',
    license='BSD licence, see LICENCE file',
    long_description=open(os.path.join(PKG_PATH, 'README.md')).read(),
    setup_requires=open(REQ_PATH).read().split('\n'),
    package_dir={'anima': 'src/anima'},
    packages=['anima'],
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        'Operating System :: OS Independent',
        'Programming Language :: JavaScript',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
    ],
    zip_safe=False,
    cmdclass={
        'bower': Bower,
        'test': Test,
    },
)
