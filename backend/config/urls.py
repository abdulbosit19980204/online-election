"""
Root URL configuration for Online Election System
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    return JsonResponse({"status": "ok", "version": "1.0.0"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health", health_check),
    # API v1
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/elections/", include("apps.elections.urls")),
    path("api/v1/votes/", include("apps.votes.urls")),
    path("api/v1/admin/", include("apps.elections.admin_urls")),
    path("api/v1/analytics/", include("apps.analytics.urls")),
    path("ckeditor5/", include('django_ckeditor_5.urls')),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
