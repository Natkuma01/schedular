from django.contrib import admin
from .models import CrownDay, PlannerData, Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("detail", "category", "date", "start", "end")
    list_filter = ("category", "date")
    search_fields = ("detail",)


admin.site.register(CrownDay)
admin.site.register(PlannerData)
