from django.contrib import admin
from .models import Vote

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'election', 'voter_hash', 'cast_at')
    list_filter = ('election', 'cast_at')
    search_fields = ('voter_hash', 'id')
    readonly_fields = ('voter_hash', 'election', 'encrypted_payload', 'cast_at')
    
    def has_add_permission(self, request):
        return False
        
    def has_change_permission(self, request, obj=None):
        return False
