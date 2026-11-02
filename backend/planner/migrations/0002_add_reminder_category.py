from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("planner", "0001_initial")]
    operations = [
        migrations.AlterField(
            model_name="task",
            name="category",
            field=models.CharField(
                choices=[
                    ("Networking Events", "Networking"),
                    ("Learning", "Learning"),
                    ("Project time", "Project"),
                    ("Job Hunt", "Job Hunt"),
                    ("House work", "House Work"),
                    ("Others", "Others"),
                    ("Reminder", "Reminder"),
                ],
                max_length=32,
            ),
        ),
    ]
