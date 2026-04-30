import uuid
from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Election(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('ended', 'Ended'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = CKEditor5Field('Description', config_name='extends', null=True, blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    results_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "elections"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Candidate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name="candidates")
    name = models.CharField(max_length=255)
    party = models.CharField(max_length=255, null=True, blank=True)
    bio = CKEditor5Field('Bio', config_name='extends', null=True, blank=True)
    photo_url = models.URLField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "candidates"

    def __str__(self):
        return f"{self.name} - {self.election.title}"
