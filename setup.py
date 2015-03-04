# -*- coding: utf-8 -*-
import sys
import os
import json
from setuptools import setup, Command


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
SRC_PATH = os.path.join(os.path.abspath(PKG_PATH), 'src')
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


from anima import __version__ as version


setup(
    name='anima',
    version=version,
    author=u'Damian Ignacio Valdés',
    author_email='damian.ignacio@gmail.com',
    include_package_data=True,
    url='https://github.com/damianignacio/anima',
    license='BSD licence, see LICENCE file',
    description='Set of tools for django framework.',
    long_description=open(os.path.join(PKG_PATH, 'README.md')).read(),
    install_requires=open(os.path.join(PKG_PATH, 'requirements.txt')).read(),
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
    },
)
