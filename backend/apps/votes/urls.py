from django.urls import path
from .views import CastVoteView, VoteStatusView, VerifyVoteView

urlpatterns = [
    path('<uuid:election_id>/', CastVoteView.as_view(), name='cast_vote'),
    path('status/<uuid:election_id>/', VoteStatusView.as_view(), name='vote_status'),
    path('verify/<str:receipt_hash>/', VerifyVoteView.as_view(), name='verify_vote'),
]
