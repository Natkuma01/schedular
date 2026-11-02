from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    path("planner/", views.planner_state, name="planner-state"),
    path("tasks/", views.tasks, name="tasks"),
    path("tasks/<uuid:task_id>/", views.task_detail, name="task-detail"),
    path("crowns/<str:day>/", views.crown_detail, name="crown-detail"),
]
