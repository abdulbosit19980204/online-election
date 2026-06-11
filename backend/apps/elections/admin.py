from django.contrib import admin
from django.utils.html import format_html
from .models import Election, Candidate

class CandidateInline(admin.TabularInline):
    model = Candidate
    extra = 1

class ElectionModelAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'start_time', 'end_time', 'results_public', 'contract_address', 'blockchain_link')
    list_filter = ('status', 'results_public')
    search_fields = ('title', 'description', 'contract_address')
    readonly_fields = ('created_at', 'updated_at')

    def blockchain_link(self, obj):
        if obj.tx_hash:
            return format_html('<a href="https://sepolia.etherscan.io/tx/{}" target="_blank" style="color: #6366f1; font-weight: bold;">View Deploy Tx</a>', obj.tx_hash)
        return "-"
    blockchain_link.short_description = "On-Chain Deploy Proof"

class CandidateModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'election', 'party')
    list_filter = ('election', 'party')
    search_fields = ('name', 'party', 'bio')

# Clear existing registrations to prevent conflicts
try:
    admin.site.unregister(Election)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(Candidate)
except admin.sites.NotRegistered:
    pass

admin.site.register(Election, ElectionModelAdmin)
admin.site.register(Candidate, CandidateModelAdmin)
