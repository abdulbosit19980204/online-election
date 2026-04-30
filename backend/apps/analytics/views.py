from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models.functions import TruncHour, TruncMinute
from django.db.models import Count
from apps.elections.models import Election
from apps.votes.models import Vote
from apps.accounts.permissions import IsAdminUser
from apps.elections.serializers import ElectionResultSerializer


class ElectionAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        election = get_object_or_404(Election, pk=pk)
        
        # 1. Base results using our serializer logic
        base_data = ElectionResultSerializer(election).data
        
        # 2. Time series data: votes over time
        # We can group by minute or hour depending on duration
        duration = election.end_time - election.start_time
        trunc_func = TruncMinute if duration.days < 1 else TruncHour
        
        time_series = (
            Vote.objects.filter(election=election)
            .annotate(timestamp=trunc_func('cast_at'))
            .values('timestamp')
            .annotate(count=Count('id'))
            .order_by('timestamp')
        )

        base_data['votes_over_time'] = [
            {
                "timestamp": item['timestamp'].isoformat(),
                "count": item['count']
            } for item in time_series
        ]

        return Response(base_data)
