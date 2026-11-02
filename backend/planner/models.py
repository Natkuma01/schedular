import uuid
from django.conf import settings
from django.db import models


class Task(models.Model):
    class Category(models.TextChoices):
        NETWORKING = "Networking Events"
        LEARNING = "Learning"
        PROJECT = "Project time"
        JOB_HUNT = "Job Hunt"
        HOUSE_WORK = "House work"
        OTHERS = "Others"
        REMINDER = "Reminder"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="planner_tasks")
    date = models.DateField(db_index=True)
    category = models.CharField(max_length=32, choices=Category.choices)
    detail = models.CharField(max_length=240)
    start = models.TimeField(null=True, blank=True)
    end = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "start", "created_at"]


class CrownDay(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="crown_days")
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date"]
        constraints = [models.UniqueConstraint(fields=["owner", "date"], name="unique_crown_per_user_day")]


class PlannerData(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="planner_data")
    state = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)
