from django.urls import path
from .admin_views import (
    AdminElectionListCreateView,
    AdminElectionUpdateDeleteView,
    AdminAddCandidateView,
    AdminPublishResultsView,
    AdminStatsView
)

urlpatterns = [
    path('elections/', AdminElectionListCreateView.as_view(), name='admin_election_list'),
    path('elections/<uuid:pk>/', AdminElectionUpdateDeleteView.as_view(), name='admin_election_detail'),
    path('elections/<uuid:pk>/candidates/', AdminAddCandidateView.as_view(), name='admin_add_candidate'),
    path('elections/<uuid:pk>/publish/', AdminPublishResultsView.as_view(), name='admin_publish_results'),
    path('stats/', AdminStatsView.as_view(), name='admin_stats'),
]
