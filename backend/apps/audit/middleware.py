import logging
from django.utils.deprecation import MiddlewareMixin
from django.urls import resolve
from .utils import log_action

logger = logging.getLogger(__name__)

class AuditMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            try:
                # Exclude some paths if needed
                if request.path.startswith("/api/v1/votes/status/"):
                    return response

                user = request.user
                action = f"{request.method} {request.path}"
                ip_address = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))
                user_agent = request.META.get('HTTP_USER_AGENT', '')
                
                status_code = response.status_code
                action = f"{action} [{status_code}]"

                if status_code < 400:
                    log_action(
                        user=user,
                        action=action,
                        ip_address=ip_address,
                        user_agent=user_agent
                    )
            except Exception as e:
                logger.error(f"AuditMiddleware error: {e}")

        return response
