from django.urls import path
from .views import LoginView, LogoutView, RegisterView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("signup/", RegisterView.as_view()),
]
