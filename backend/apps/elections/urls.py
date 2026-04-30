from django.urls import path
from .views import ElectionListView, ElectionDetailView, ElectionResultView

urlpatterns = [
    path('', ElectionListView.as_view(), name='election_list'),
    path('<uuid:pk>/', ElectionDetailView.as_view(), name='election_detail'),
    path('<uuid:pk>/results/', ElectionResultView.as_view(), name='election_results'),
]
