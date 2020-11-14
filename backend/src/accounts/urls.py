from django.urls import path
from .views import LoginView, LogoutView, RegisterView, UserDetailsView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("signup/", RegisterView.as_view()),
    path("user/", UserDetailsView.as_view()),
]
