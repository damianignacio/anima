from django.test import TestCase
from django.db import models, connection

from ..fields import JsonField, ImageField


# Without default
class SimpleModel(models.Model):
    json = JsonField()

    class Meta:
        db_table = 'simple'


class SimpleCompactModel(models.Model):
    json = JsonField(compact=True, default={'foo': ['bar', 'baz']})

    class Meta:
        db_table = 'simple_compact'


# With default
class DefaultDictModel(models.Model):
    json = JsonField(default={'default': 'Default value'})

    class Meta:
        db_table = 'default_dict'


class DefaultListModel(models.Model):
    json = JsonField(default=['Default value'])

    class Meta:
        db_table = 'default_list'


# Helper
def execute_sql(*sql):
    cursor = connection.cursor()
    cursor.execute(*sql)
    desc = cursor.description
    return [
        dict(zip([col[0] for col in desc], row))
        for row in cursor.fetchall()
    ]


class FieldsTests(TestCase):

    def test_compact_default_value(self):
        model = SimpleCompactModel.objects.create()
        self.assertEquals(['bar', 'baz'], model.json['foo'])

        # Check the underlying value
        result = execute_sql(
            "SELECT json FROM simple_compact WHERE id = %s", [
                model.id
            ]
        )
        self.assertEquals('{"foo":["bar","baz"]}', result[0]['json'])

    def test_default_value_null(self):
        model = SimpleModel.objects.create()
        self.assertIsNone(model.json)

        # Check the underlying value
        result = execute_sql(
            "SELECT json FROM simple WHERE id = %s", [
                model.id
            ]
        )
        self.assertEquals('null', result[0]['json'])

    def test_default_value_dict(self):
        model = DefaultDictModel.objects.create()
        self.assertEquals('Default value', model.json['default'])

        # Check the underlying value
        result = execute_sql(
            "SELECT json FROM default_dict WHERE id = %s", [
                model.id
            ]
        )
        self.assertEquals('{"default": "Default value"}', result[0]['json'])

    def test_default_value_list(self):
        model = DefaultListModel.objects.create()
        self.assertEquals('Default value', model.json[0])

        # Check the underlying value
        result = execute_sql(
            "SELECT json FROM default_list WHERE id = %s", [
                model.id
            ]
        )
        self.assertEquals('["Default value"]', result[0]['json'])

    def test_update_value(self):
        model = SimpleModel()
        model.json = {'other': 'Other value'}
        model.save()

        model = SimpleModel.objects.get(pk=model.pk)
        self.assertEquals('Other value', model.json['other'])

    def test_storing_none(self):
        model = SimpleModel.objects.create(json={'foo': 'bar'})
        self.assertEquals('bar', model.json['foo'])

        model.json = None
        model.save()

        # Refresh from db
        model = SimpleModel.objects.get(pk=model.pk)
        self.assertIsNone(model.json)

        # Check the underlying value
        result = execute_sql(
            "SELECT json FROM simple WHERE id = %s", [
                model.id
            ]
        )
        self.assertEquals('null', result[0]['json'])

    def test_storing_list(self):
        model = SimpleModel()
        model.json = ['foo', 'bar']
        model.save()

        model = SimpleModel.objects.get(pk=model.pk)
        self.assertEquals(2, len(model.json))
        self.assertEquals('foo', model.json[0])
        self.assertEquals('bar', model.json[1])

        # Check the underlying value
        result = execute_sql(
            "SELECT json FROM simple WHERE id = %s", [
                model.id
            ]
        )
        self.assertEquals('["foo", "bar"]', result[0]['json'])

    def test_image_field_multiple_wrong_default(self):
        field = ImageField(multiple=True, default={})
        checks = field.check()
        self.assertEquals(1, len(checks))
        self.assertTrue(
            'If multiple is true default must be a list.' in checks[0].msg
        )

    def test_image_field_mutiple_default(self):
        field = ImageField(multiple=True, default=[])
        checks = field.check()
        self.assertEquals(0, len(checks))

    def test_image_field_default_dict(self):
        field = ImageField(multiple=False, default={})
        checks = field.check()
        self.assertEquals(0, len(checks))

    def test_image_field_default_none(self):
        field = ImageField(multiple=False, default=None)
        checks = field.check()
        self.assertEquals(0, len(checks))

    def test_image_field_wrong_default(self):
        field = ImageField(multiple=False, default=[])
        checks = field.check()
        self.assertEquals(1, len(checks))
        self.assertTrue(
            'If multiple is false default must be None or a dict.' in checks[0].msg
        )

    def test_image_field(self):
        field = ImageField()
        checks = field.check()
        self.assertEquals(0, len(checks))
