from rest_framework import serializers

class VoteCastSerializer(serializers.Serializer):
    candidate_id = serializers.UUIDField()

class VoteStatusSerializer(serializers.Serializer):
    has_voted = serializers.BooleanField()
    cast_at = serializers.DateTimeField(required=False, allow_null=True)
    receipt_hash = serializers.CharField(required=False, allow_null=True)
