import uuid
from django.db import models
from apps.elections.models import Election


class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    voter_hash = models.CharField(max_length=64)  # SHA-256 hash of user_id + election_id
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="votes")
    encrypted_payload = models.TextField()  # Fernet encrypted candidate_id
    cast_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "votes"
        # Database level enforcement of 1 person = 1 vote per election
        constraints = [
            models.UniqueConstraint(fields=['voter_hash', 'election'], name='unique_voter_per_election')
        ]
        indexes = [
            models.Index(fields=["election"]),
            models.Index(fields=["voter_hash"]),
        ]

    def __str__(self):
        return str(self.id)
