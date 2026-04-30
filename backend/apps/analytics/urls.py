from django.urls import path
from .views import ElectionAnalyticsView

urlpatterns = [
    path('elections/<uuid:pk>/', ElectionAnalyticsView.as_view(), name='election_analytics'),
]
