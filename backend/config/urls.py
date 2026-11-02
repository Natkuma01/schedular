from django.contrib import admin
from django.urls import include, path
from planner.views import frontend
from rest_framework_simplejwt.views import TokenBlacklistView, TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("api/auth/logout/", TokenBlacklistView.as_view(), name="token-blacklist"),
    path("api/", include("planner.urls")),
    path("", frontend, name="frontend"),
    path("<path:asset>", frontend, name="frontend-asset"),
]
