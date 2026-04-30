from rest_framework import serializers
from .models import Election, Candidate
from apps.votes.models import Vote


class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'name', 'party', 'bio', 'photo_url')


class CandidateResultSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = Candidate
        fields = ('id', 'name', 'party', 'bio', 'photo_url', 'vote_count', 'percentage')

    def get_vote_count(self, obj):
        return getattr(obj, 'vote_count', 0)

    def get_percentage(self, obj):
        total = self.context.get('total_votes', 0)
        count = self.get_vote_count(obj)
        if total > 0:
            return round((count / total) * 100, 1)
        return 0.0


class ElectionListSerializer(serializers.ModelSerializer):
    candidates = CandidateSerializer(many=True, read_only=True)

    class Meta:
        model = Election
        fields = ('id', 'title', 'description', 'start_time', 'end_time', 'status', 'results_public', 'created_at', 'candidates')


class ElectionDetailSerializer(serializers.ModelSerializer):
    candidates = CandidateSerializer(many=True, read_only=True)

    class Meta:
        model = Election
        fields = ('id', 'title', 'description', 'start_time', 'end_time', 'status', 'results_public', 'candidates')


class ElectionResultSerializer(serializers.ModelSerializer):
    candidates = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = ('id', 'title', 'description', 'start_time', 'end_time', 'status', 'results_public', 'total_votes', 'candidates')

    def get_total_votes(self, obj):
        return Vote.objects.filter(election=obj).count()

    def get_candidates(self, obj):
        total = self.get_total_votes(obj)
        # Using a raw query or manual count in view for optimization, but here we annotate.
        # We assume the view annotates `vote_count` onto the candidates.
        cands = obj.candidates.all()
        # manual count fallback
        for c in cands:
            if not hasattr(c, 'vote_count'):
                c.vote_count = Vote.objects.filter(election=obj, encrypted_payload__startswith=str(c.id)).count() # Note: encryption means we can't do this easily in DB!
                # Wait, Fernet encrypted payload makes DB COUNT impossible by candidate ID.
                # Since vote payload is encrypted, we must decrypt them in Python to count.
        
        # Proper way to count votes: fetch all votes for this election, decrypt, and aggregate.
        votes = Vote.objects.filter(election=obj)
        counts = {}
        for c in cands:
            counts[str(c.id)] = 0
            
        from utils.encryption import decrypt_vote
        for v in votes:
            decrypted = decrypt_vote(v.encrypted_payload)
            cid = decrypted.get("candidate_id")
            if cid in counts:
                counts[cid] += 1
                
        for c in cands:
            c.vote_count = counts.get(str(c.id), 0)
            
        return CandidateResultSerializer(cands, many=True, context={'total_votes': total}).data
