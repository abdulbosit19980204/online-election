from django.contrib import admin
from django.utils.html import format_html
from .models import Vote

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'election', 'voter_hash', 'cast_at', 'blockchain_link')
    list_filter = ('election', 'cast_at')
    search_fields = ('voter_hash', 'id', 'tx_hash')
    readonly_fields = ('voter_hash', 'election', 'encrypted_payload', 'tx_hash', 'cast_at')
    
    def blockchain_link(self, obj):
        if obj.tx_hash:
            return format_html('<a href="https://sepolia.etherscan.io/tx/{}" target="_blank" style="color: #10b981; font-weight: bold;">Verify on Etherscan</a>', obj.tx_hash)
        return "-"
    blockchain_link.short_description = "On-Chain Vote Proof"

    def has_add_permission(self, request):
        return False
        
    def has_change_permission(self, request, obj=None):
        return False
