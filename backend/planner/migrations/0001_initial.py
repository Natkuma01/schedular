import uuid
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [
        migrations.CreateModel(name="CrownDay", fields=[("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")), ("date", models.DateField()), ("created_at", models.DateTimeField(auto_now_add=True)), ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="crown_days", to=settings.AUTH_USER_MODEL))], options={"ordering": ["date"], "constraints": [models.UniqueConstraint(fields=("owner", "date"), name="unique_crown_per_user_day")]}),
        migrations.CreateModel(name="Task", fields=[("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)), ("date", models.DateField(db_index=True)), ("category", models.CharField(choices=[("Networking Events", "Networking"), ("Learning", "Learning"), ("Project time", "Project"), ("Job Hunt", "Job Hunt"), ("House work", "House Work"), ("Others", "Others")], max_length=32)), ("detail", models.CharField(max_length=240)), ("start", models.TimeField(blank=True, null=True)), ("end", models.TimeField(blank=True, null=True)), ("created_at", models.DateTimeField(auto_now_add=True)), ("updated_at", models.DateTimeField(auto_now=True)), ("owner", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="planner_tasks", to=settings.AUTH_USER_MODEL))], options={"ordering": ["date", "start", "created_at"]}),
    ]
