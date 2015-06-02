SECRET_KEY = 'foo'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    },
}

INSTALLED_APPS = (
    'anima',
)
MIDDLEWARE_CLASSES = ()

ROOT_URLCONF = 'anima.tests.urls'
