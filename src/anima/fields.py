import json
import six
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django import forms
from .widgets import SelectImageWidget
from django.core import exceptions, checks


class JsonFormField(forms.Field):

    def clean(self, value):
        return super(JsonFormField, self).clean(value)


class JsonField(six.with_metaclass(models.SubfieldBase, models.Field)):

    description = _('Json')

    def __init__(self, default=None, compact=False, blank=False, verbose_name=None):
        self.compact = compact
        if self.compact:
            self.separators = (',', ':')
        else:
            self.separators = (', ', ': ')

        kwargs = {
            'default': default,
            'null': False,  # Enforce to store 'null' for None value
            'blank': blank,
            'verbose_name': verbose_name,
        }

        super(JsonField, self).__init__(**kwargs)

    def get_internal_type(self):
        return 'TextField'

    def get_default(self):
        return self.to_python(self.default)

    def value_to_string(self, obj):
        value = self._get_val_from_obj(obj)
        return json.dumps(value)

    def from_db_value(self, value, expression, connection, context):
        return self.to_python(value)

    def to_python(self, value):
        if isinstance(value, six.string_types):

            if not value:
                return None

            try:
                return json.loads(value)
            except ValueError:
                raise exceptions.ValidationError(_('Enter valid JSON'))
        return value

    def get_db_prep_value(self, value, connection, prepared=False):
        return json.dumps(value, separators=self.separators)

    def deconstruct(self):
        name, path, args, kwargs = super(JsonField, self).deconstruct()
        if self.compact:
            kwargs['compact'] = self.compact

        return name, path, args, kwargs

    def formfield(self, **kwargs):
        defaults = {
            'form_class': JsonFormField,
            'widget': forms.Textarea
        }
        defaults.update(kwargs)
        return super(JsonField, self).formfield(**defaults)


class ImageFormField(JsonFormField):

    def __init__(self, *args, **kwargs):
        self.multiple = kwargs.pop('multiple', False)
        super(ImageFormField, self).__init__(*args, **kwargs)

    def widget_attrs(self, widget):
        return {
            'multiple': self.multiple,
        }


class ImageField(six.with_metaclass(models.SubfieldBase, JsonField)):

    def __init__(self, multiple=False, compact=False, default=None, blank=False, verbose_name=None):
        self.multiple = multiple

        kwargs = {
            'default': default,
            'compact': compact,
            'blank': blank,
            'verbose_name': verbose_name,
        }

        super(ImageField, self).__init__(**kwargs)

    def formfield(self, **kwargs):
        defaults = {
            'form_class': ImageFormField,
            'widget': SelectImageWidget,
            'multiple': self.multiple,
        }
        defaults.update(kwargs)
        return super(ImageField, self).formfield(**defaults)

    def deconstruct(self):
        name, path, args, kwargs = super(ImageField, self).deconstruct()
        if self.multiple:
            kwargs['multiple'] = self.multiple
        return name, path, args, kwargs

    def check(self):
        default = self.to_python(self.default)

        errors = []

        # TODO validate schema
        if self.multiple and not isinstance(default, list):
            errors.append(
                checks.Error(
                    'If multiple is true default must be a list.',
                    hint=None,
                    obj=self,
                    id='anima.fields.E001',
                )
            )

        if not self.multiple and \
                not (isinstance(default, dict) or default is None):

            errors.append(
                checks.Error(
                    'If multiple is false default must be None or a dict.',
                    hint=None,
                    obj=self,
                    id='anima.fields.E002',
                )
            )

        return errors
