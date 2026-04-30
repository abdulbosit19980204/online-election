from django.urls import path
from .views import CastVoteView, VoteStatusView

urlpatterns = [
    path('<uuid:election_id>/', CastVoteView.as_view(), name='cast_vote'),
    path('status/<uuid:election_id>/', VoteStatusView.as_view(), name='vote_status'),
]
