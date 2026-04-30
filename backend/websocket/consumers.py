import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ElectionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.election_id = self.scope['url_route']['kwargs']['election_id']
        self.group_name = f"election_{self.election_id}"

        # Join election group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave election group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from room group
    async def vote_update(self, event):
        data = event['data']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(data))
