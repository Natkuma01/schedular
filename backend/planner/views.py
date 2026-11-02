import json
from datetime import date, time
from pathlib import Path
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import connection
from django.http import FileResponse, Http404, HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CrownDay, PlannerData, Task


def frontend(request: HttpRequest, asset: str = "") -> FileResponse:
    root = Path(settings.FRONTEND_DIR).resolve()
    requested = (root / (asset or "index.html")).resolve()
    if root not in requested.parents and requested != root:
        raise Http404
    if requested.is_dir():
        requested = requested / "index.html"
    if not requested.is_file():
        requested = root / "404.html"
    if not requested.is_file():
        raise Http404("Frontend has not been built. Run npm run build:static.")
    return FileResponse(requested.open("rb"))


def task_json(task: Task) -> dict:
    return {
        "id": str(task.id),
        "date": task.date.isoformat(),
        "category": task.category,
        "detail": task.detail,
        "start": task.start.strftime("%H:%M") if task.start else None,
        "end": task.end.strftime("%H:%M") if task.end else None,
    }


def body_json(request: HttpRequest) -> dict:
    try:
        value = json.loads(request.body or b"{}")
    except json.JSONDecodeError as error:
        raise ValueError("Request body must be valid JSON") from error
    if not isinstance(value, dict):
        raise ValueError("Request body must be a JSON object")
    return value


def clean_planner_state(data: dict) -> dict:
    tasks = data.get("tasks", [])
    crowns = data.get("crowns", {})
    cats = data.get("cats", [])
    if not isinstance(tasks, list) or not isinstance(crowns, dict) or not isinstance(cats, list):
        raise ValueError("tasks and cats must be arrays, and crowns must be an object")
    if len(tasks) > 5000 or len(cats) > 100 or len(crowns) > 5000:
        raise ValueError("Planner state is too large")
    state = {"tasks": tasks, "crowns": crowns, "cats": cats}
    if len(json.dumps(state).encode("utf-8")) > 1_000_000:
        raise ValueError("Planner state must be smaller than 1 MB")
    return state


def parse_task(data: dict, partial: bool = False, current_category: str | None = None) -> dict:
    parsed = {}
    for field in ("date", "category", "detail", "start", "end"):
        if field not in data:
            continue
        value = data[field]
        if field == "date":
            parsed[field] = date.fromisoformat(value)
        elif field in {"start", "end"}:
            parsed[field] = time.fromisoformat(value) if value else None
        elif field == "category":
            if value not in Task.Category.values:
                raise ValueError("Unknown category")
            parsed[field] = value
        elif field == "detail":
            value = str(value).strip()
            if not value or len(value) > 240:
                raise ValueError("Detail must be between 1 and 240 characters")
            if data.get("category", current_category) == Task.Category.REMINDER and len(value) > 80:
                raise ValueError("A reminder must be 80 characters or fewer")
            parsed[field] = value
    required = {"date", "category", "detail"}
    if not partial and not required.issubset(parsed):
        raise ValueError("date, category, and detail are required")
    if parsed.get("start") and parsed.get("end") and parsed["end"] <= parsed["start"]:
        raise ValueError("End time must be after start time")
    return parsed


@api_view(["GET"])
@permission_classes([AllowAny])
@throttle_classes([])
def health(request: HttpRequest) -> JsonResponse:
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    return JsonResponse({"status": "ok"})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request: HttpRequest) -> JsonResponse:
    try:
        data = body_json(request)
        username = str(data.get("username", "")).strip()
        email = str(data.get("email", "")).strip().lower()
        password = str(data.get("password", ""))
        if not username or not email or not password:
            raise ValueError("Username, email, and password are required")
        User = get_user_model()
        if User.objects.filter(email__iexact=email).exists():
            raise ValueError("An account with this email already exists")
        user = User(username=username, email=email)
        user.full_clean(exclude=["password"])
        validate_password(password, user=user)
        user.set_password(password)
        user.save()
        PlannerData.objects.create(owner=user, state={"tasks": [], "crowns": {}, "cats": []})
    except ValidationError as error:
        message = next(iter(error.message_dict.values()))[0] if hasattr(error, "message_dict") else error.messages[0]
        return JsonResponse({"error": message}, status=400)
    except (TypeError, ValueError) as error:
        return JsonResponse({"error": str(error)}, status=400)
    refresh = RefreshToken.for_user(user)
    return JsonResponse({"access": str(refresh.access_token), "refresh": str(refresh), "user": {"username": user.username}}, status=201)


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def planner_state(request: HttpRequest) -> JsonResponse:
    planner, created = PlannerData.objects.get_or_create(owner=request.user)
    if request.method == "PUT":
        try:
            planner.state = clean_planner_state(body_json(request))
        except (TypeError, ValueError) as error:
            return JsonResponse({"error": str(error)}, status=400)
        planner.save(update_fields=["state", "updated_at"])
    return JsonResponse({**clean_planner_state(planner.state), "has_state": not created, "user": {"username": request.user.get_username()}})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def tasks(request: HttpRequest) -> JsonResponse:
    try:
        task = Task.objects.create(owner=request.user, **parse_task(body_json(request)))
    except (TypeError, ValueError) as error:
        return JsonResponse({"error": str(error)}, status=400)
    return JsonResponse(task_json(task), status=201)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def task_detail(request: HttpRequest, task_id) -> JsonResponse:
    task = get_object_or_404(Task, id=task_id, owner=request.user)
    if request.method == "DELETE":
        task.delete()
        return JsonResponse({}, status=204)
    try:
        values = parse_task(body_json(request), partial=True, current_category=task.category)
    except (TypeError, ValueError) as error:
        return JsonResponse({"error": str(error)}, status=400)
    for field, value in values.items():
        setattr(task, field, value)
    task.full_clean()
    task.save()
    return JsonResponse(task_json(task))


@api_view(["PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def crown_detail(request: HttpRequest, day: str) -> JsonResponse:
    try:
        parsed_day = date.fromisoformat(day)
    except ValueError:
        return JsonResponse({"error": "Date must use YYYY-MM-DD"}, status=400)
    if request.method == "DELETE":
        CrownDay.objects.filter(owner=request.user, date=parsed_day).delete()
        return JsonResponse({}, status=204)
    crown, created = CrownDay.objects.get_or_create(owner=request.user, date=parsed_day)
    return JsonResponse({"date": crown.date.isoformat()}, status=201 if created else 200)
