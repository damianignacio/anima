import json
from django.forms.widgets import Widget
from django.utils.html import format_html
from django.forms.utils import flatatt


SELECT_IMAGE_TPL = """
<anima-select-image {}>
    <div class="anm-loading">
        <i class="fa fa-cog fa-spin"></i>
    </div>
</anima-select-image>
"""


class SelectImageWidget(Widget):

    class Media:
        js = (
            'anima/js/widgets/select-image.js',
        )

    def value_from_datadict(self, data, files, name):
        return json.loads(data.get(name, '[]'))

    def __init__(self, attrs=None):
        default_attrs = {
            'path': None,
        }
        if attrs:
            default_attrs.update(attrs)

        super(SelectImageWidget, self).__init__(default_attrs)

    def _parse_value(self, name, value, attrs):
        return {
            'name': name,
            'value': value or [],
            'path': attrs['path'],
        }

    def render(self, name, value, attrs=None):
        final_attrs = self.build_attrs(attrs)
        return format_html(SELECT_IMAGE_TPL, flatatt({
            'options': json.dumps(self._parse_value(name, value, final_attrs))
        }))
