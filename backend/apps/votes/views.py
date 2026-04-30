import hashlib
from datetime import datetime
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Vote
from apps.elections.models import Election, Candidate
from .serializers import VoteCastSerializer, VoteStatusSerializer
from utils.encryption import encrypt_vote


def generate_voter_hash(user_id: str, election_id: str) -> str:
    """Generate deterministic, irreversible hash for anonymity"""
    salt = settings.VOTE_SALT
    raw = f"{user_id}:{election_id}:{salt}"
    return hashlib.sha256(raw.encode()).hexdigest()


class CastVoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, election_id):
        serializer = VoteCastSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        candidate_id = serializer.validated_data['candidate_id']

        # 1. Validation
        election = get_object_or_404(Election, pk=election_id)
        if election.status != 'active':
            return Response({"detail": "Election is not active"}, status=status.HTTP_400_BAD_REQUEST)
        
        now = timezone.now()
        if now < election.start_time or now > election.end_time:
            return Response({"detail": "Election is outside voting window"}, status=status.HTTP_400_BAD_REQUEST)
            
        get_object_or_404(Candidate, pk=candidate_id, election=election)

        # 2. Anonymization & Encryption
        voter_hash = generate_voter_hash(str(request.user.id), str(election.id))
        cast_time = timezone.now()
        encrypted_payload = encrypt_vote(str(candidate_id), str(election.id), cast_time.isoformat())

        # 3. Store Vote
        try:
            vote = Vote.objects.create(
                voter_hash=voter_hash,
                election=election,
                encrypted_payload=encrypted_payload,
                cast_at=cast_time
            )
        except IntegrityError:
            return Response({"detail": "You have already voted in this election"}, status=status.HTTP_409_CONFLICT)

        # 4. Generate receipt (SHA256 of vote ID)
        receipt_hash = hashlib.sha256(str(vote.id).encode()).hexdigest()

        # 5. Broadcast update via WebSockets
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"election_{election.id}",
                {
                    "type": "vote_update",
                    "data": {"event": "new_vote"}
                }
            )

        return Response({
            "id": vote.id,
            "election_id": election.id,
            "cast_at": vote.cast_at,
            "receipt_hash": receipt_hash
        }, status=status.HTTP_201_CREATED)


class VoteStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, election_id):
        voter_hash = generate_voter_hash(str(request.user.id), str(election_id))
        vote = Vote.objects.filter(voter_hash=voter_hash, election_id=election_id).first()
        
        if vote:
            receipt_hash = hashlib.sha256(str(vote.id).encode()).hexdigest()
            return Response({
                "has_voted": True,
                "cast_at": vote.cast_at,
                "receipt_hash": receipt_hash
            })
        return Response({"has_voted": False, "cast_at": None, "receipt_hash": None})
