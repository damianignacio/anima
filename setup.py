# -*- coding: utf-8 -*-
import sys
import os
from setuptools import setup, Command


PKG_PATH = os.path.abspath(os.path.dirname(__file__))
SRC_PATH = os.path.join(PKG_PATH, 'src')
VER_PATH = os.path.join(PKG_PATH, 'src', 'anima', '__init__.py')
REQ_PATH = os.path.join(PKG_PATH, 'requirements.txt')
sys.path.append(SRC_PATH)


class Static(Command):

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
        os.system('rm -rf ./bower_components ./src/anima/static/anima/lib/')
        os.system('npm install')
        os.system('node_modules/bower/bin/bower install')
        os.system('node_modules/.bin/gulp bower')


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
    license='MIT',
    description='Yet another set of tools for django.',
    long_description=open(os.path.join(PKG_PATH, 'README.rst')).read(),
    install_requires=open(REQ_PATH).read().split('\n'),
    test_suite='anima.tests.run',
    tests_require=open(REQ_PATH).read().split('\n'),
    package_dir={'anima': 'src/anima'},
    packages=['anima'],
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Natural Language :: English',
        'Operating System :: OS Independent',
        'Programming Language :: JavaScript',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
    ],
    zip_safe=False,
    cmdclass={
        'static': Static,
    }
)
