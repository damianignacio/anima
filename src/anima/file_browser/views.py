import base64
import hmac
import sha
import json
from datetime import datetime, timedelta
from django.utils.translation import ugettext as _
from django.http.response import JsonResponse, HttpResponseBadRequest
from boto.s3.connection import S3Connection

from anima.conf import anima_settings

from . import FileBrowser, DeleteDeniedException
from .signals import pre_delete, post_delete


S3 = anima_settings.FILE_BROWSER['s3']
S3_BUCKET = S3['bucket'].strip('/')
S3_BUCKET_PATH = S3['bucket_path'].strip('/') + '/'
S3_BUCKET_URL = S3['bucket_url'].rstrip('/') + '/'
S3_ACCESS_KEY_ID = S3['access_key_id']
S3_SECRET_ACCESS_KEY = S3['secret_access_key']


def _s3_signature(policy, secret_access_key):
    return base64.encodestring(hmac.new(
        secret_access_key, policy, sha
    ).digest()).replace('\n', '')


def _s3_policy(key, bucket, acl, expiration, content_type):
    return base64.encodestring(json.dumps({
        'expiration': expiration.strftime("%Y-%m-%dT%H:%M:%SZ"),
        'conditions': [
            {'bucket': bucket},
            {'acl': acl},
            {'key': key},
            {'Content-Type': content_type},
        ]
    })).replace('\n', '').replace('\t', '')


def sign_upload(request):

    acl = 'public-read'
    expiration = datetime.utcnow() + timedelta(minutes=30)

    # Get data
    key = request.POST.get('key')
    content_type = request.POST.get('content_type')

    if not all([key, content_type]):
        return HttpResponseBadRequest()

    key = S3_BUCKET_PATH + key

    # Prepare signature
    policy = _s3_policy(key, S3_BUCKET, acl, expiration, content_type)
    signature = _s3_signature(policy, S3_SECRET_ACCESS_KEY)

    return JsonResponse({
        'url': S3_BUCKET_URL,
        'acl': acl,
        'key': key,
        'policy': policy,
        'signature': signature,
        'AWSAccessKeyId': S3_ACCESS_KEY_ID,
    })


def delete(request):

    # Get data
    key = request.POST.get('key')

    if not key:
        return HttpResponseBadRequest()

    url = S3_BUCKET_URL + S3_BUCKET_PATH + key

    errors = []
    responses = pre_delete.send_robust(sender=FileBrowser, url=url)
    for receiver, response in responses:
        if isinstance(response, DeleteDeniedException):
            errors.append(str(response))

    if errors:
        if not any(errors):
            errors = [
                _('An error ocurr the file cannot be deleted.')
            ]
        return JsonResponse({
            'errors': errors,
        })

    conn = S3Connection(S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY)
    b = conn.get_bucket(S3_BUCKET)
    b.delete_key(S3_BUCKET_PATH + key)

    post_delete.send_robust(sender=FileBrowser, url=url)

    return JsonResponse({})
