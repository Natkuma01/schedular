from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase

from .models import CrownDay, Task


class PlannerApiTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="natalie", password="strong-test-password")
        self.other_user = get_user_model().objects.create_user(username="other", password="strong-test-password")
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_jwt_login_and_protected_endpoint(self):
        anonymous = APIClient()
        self.assertEqual(anonymous.get(reverse("planner-state")).status_code, 401)
        response = anonymous.post(reverse("token-obtain-pair"), {"username": "natalie", "password": "strong-test-password"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())
        anonymous.credentials(HTTP_AUTHORIZATION=f"Bearer {response.json()['access']}")
        self.assertEqual(anonymous.get(reverse("planner-state")).status_code, 200)

    def test_task_lifecycle_is_scoped_to_user(self):
        response = self.client.post(reverse("tasks"), {"date": "2026-11-01", "category": "Learning", "detail": "Django", "start": "09:00", "end": "10:00"}, format="json")
        self.assertEqual(response.status_code, 201)
        task_id = response.json()["id"]
        self.assertEqual(Task.objects.get(id=task_id).owner, self.user)
        response = self.client.patch(reverse("task-detail", args=[task_id]), {"date": "2026-11-02"}, format="json")
        self.assertEqual(response.json()["date"], "2026-11-02")
        other = APIClient()
        other.force_authenticate(self.other_user)
        self.assertEqual(other.patch(reverse("task-detail", args=[task_id]), {"date": "2026-11-03"}, format="json").status_code, 404)
        self.assertEqual(self.client.delete(reverse("task-detail", args=[task_id])).status_code, 204)

    def test_crown_toggle_is_scoped_to_user(self):
        url = reverse("crown-detail", args=["2026-11-01"])
        self.assertEqual(self.client.put(url).status_code, 201)
        self.assertTrue(CrownDay.objects.filter(owner=self.user).exists())
        self.assertEqual(self.client.delete(url).status_code, 204)

    def test_rejects_invalid_task(self):
        response = self.client.post(reverse("tasks"), {"date": "2026-11-01", "category": "Nope", "detail": "x"}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_reminder_with_optional_time(self):
        response = self.client.post(reverse("tasks"), {"date": "2026-11-01", "category": "Reminder", "detail": "Call the doctor", "start": "15:30"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["category"], "Reminder")
        self.assertEqual(response.json()["start"], "15:30")
