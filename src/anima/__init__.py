# -*- coding: utf-8 -*-

__version__ = '0.6.0'


from django.apps import AppConfig


class Config(AppConfig):

    label = 'anima'
    verbose_name = 'Anima'
    name = 'anima'
    models_module = 'anima.models'
