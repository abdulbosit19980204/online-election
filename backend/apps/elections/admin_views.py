from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Election, Candidate
from apps.accounts.permissions import IsAdminUser
from .serializers import ElectionDetailSerializer, CandidateSerializer


class AdminElectionListCreateView(generics.ListCreateAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionDetailSerializer
    permission_classes = [IsAdminUser]


class AdminElectionUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionDetailSerializer
    permission_classes = [IsAdminUser]

    def patch(self, request, *args, **kwargs):
        print(f"DEBUG: Admin updating election {kwargs.get('pk')} with data: {request.data}")
        return super().patch(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        print(f"DEBUG: Admin updating election {kwargs.get('pk')} with data: {request.data}")
        return super().put(request, *args, **kwargs)


class AdminAddCandidateView(generics.CreateAPIView):
    serializer_class = CandidateSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        election = get_object_or_404(Election, pk=self.kwargs['pk'])
        serializer.save(election=election)


class AdminCandidateUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [IsAdminUser]


class AdminPublishResultsView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        print(f"DEBUG: Publishing results for election {pk}")
        election = get_object_or_404(Election, pk=pk)
        election.results_public = True
        election.status = 'ended'
        election.save()
        return Response({"status": "published"})


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from apps.votes.models import Vote
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        return Response({
            "total_elections": Election.objects.count(),
            "active_elections": Election.objects.filter(status='active').count(),
            "total_users": User.objects.count(),
            "total_votes": Vote.objects.count(),
            "total_voters": Vote.objects.values('voter_hash').distinct().count(),
        })
