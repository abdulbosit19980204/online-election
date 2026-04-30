from django.contrib import admin
from .models import Election, Candidate

class CandidateInline(admin.TabularInline):
    model = Candidate
    extra = 1

class ElectionModelAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'start_time', 'end_time', 'results_public')
    list_filter = ('status', 'results_public')
    search_fields = ('title', 'description')
    # inlines = [CandidateInline] # Keeping it commented for now to be safe

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
