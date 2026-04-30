from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'user', 'entity_type', 'created_at', 'ip_address')
    list_filter = ('action', 'entity_type', 'created_at')
    search_fields = ('user__email', 'action', 'details', 'ip_address')
    readonly_fields = ('user', 'action', 'entity_type', 'entity_id', 'ip_address', 'user_agent', 'details', 'created_at')
    date_hierarchy = 'created_at'

    def has_add_permission(self, request):
        return False
        
    def has_change_permission(self, request, obj=None):
        return False
        
    def has_delete_permission(self, request, obj=None):
        return False
