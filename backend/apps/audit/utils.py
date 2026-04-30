import logging
from .models import AuditLog

logger = logging.getLogger(__name__)

def log_action(user=None, action="", entity_type=None, entity_id=None, ip_address=None, user_agent=None, details=None):
    AuditLog.objects.create(
        user=user if user and user.is_authenticated else None,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id) if entity_id else None,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details
    )
    logger.info(f"AUDIT | {action} | user={user.id if user and user.is_authenticated else None} | {entity_type}={entity_id}")
