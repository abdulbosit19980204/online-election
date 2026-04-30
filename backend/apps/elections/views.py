from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Election
from .serializers import ElectionListSerializer, ElectionDetailSerializer, ElectionResultSerializer


class ElectionListView(generics.ListAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionListSerializer
    permission_classes = [permissions.IsAuthenticated]


class ElectionDetailView(generics.RetrieveAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class ElectionResultView(generics.RetrieveAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if not obj.results_public and self.request.user.role != 'admin':
            raise PermissionDenied("Results are not public yet.")
        return obj
