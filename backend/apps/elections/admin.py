from django.contrib import admin
from .models import Election, Candidate

class CandidateInline(admin.TabularInline):
    model = Candidate
    extra = 1

class ElectionModelAdmin(admin.ModelAdmin):
    list_display = ('title', 'start_time', 'end_time', 'status', 'results_public')
    list_filter = ('status', 'results_public')
    search_fields = ('title', 'description')
    inlines = [CandidateInline]

class CandidateModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'election', 'party')
    list_filter = ('election', 'party')
    search_fields = ('name', 'party', 'bio')

admin.site.register(Election, ElectionModelAdmin)
admin.site.register(Candidate, CandidateModelAdmin)
