from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/elections/(?P<election_id>[0-9a-f-]+)/?$', consumers.ElectionConsumer.as_asgi()),
]
