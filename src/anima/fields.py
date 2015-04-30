import json
import six
import re
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.core import exceptions


class JsonField(six.with_metaclass(models.SubfieldBase, models.Field)):

    description = _('Json')

    def __init__(self, default=None, compact=False):
        self.compact = compact
        if self.compact:
            self.separators = (',', ':')
        else:
            self.separators = (', ', ': ')

        kwargs = {
            'default': json.dumps(default, separators=self.separators),
            'null': False,  # Enforce to store 'null' for None value
        }

        super(JsonField, self).__init__(**kwargs)

    def get_internal_type(self):
        return 'TextField'

    def from_db_value(self, value, expression, connection, context):
        return self.to_python(value)

    def to_python(self, value):
        if isinstance(value, six.string_types):
            try:
                return json.loads(value)
            except ValueError:
                raise exceptions.ValidationError(_("Enter valid JSON"))
        return value

    def get_db_prep_value(self, value, connection, prepared=False):
        return json.dumps(value, separators=self.separators)

    def deconstruct(self):
        name, path, args, kwargs = super(JsonField, self).deconstruct()
        if self.compact:
            kwargs['compact'] = self.compact

        kwargs['default'] = kwargs['default'].replace('\\', '')
        kwargs['default'] = re.sub(r'^"', '', kwargs['default'])
        kwargs['default'] = re.sub(r'"$', '', kwargs['default'])

        return name, path, args, kwargs
