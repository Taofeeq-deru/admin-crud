from django.contrib.auth import login as django_login, logout as django_logout
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.utils.decorators import method_decorator
from django.utils.translation import ugettext_lazy as _
from django.views.decorators.debug import sensitive_post_parameters

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny


from allauth.account import app_settings as allauth_settings

from rest_auth.app_settings import (
    TokenSerializer,
    UserDetailsSerializer,
    LoginSerializer,
    JWTSerializer,
    create_token,
)
from rest_auth.models import TokenModel
from rest_auth.utils import jwt_encode
from rest_auth.registration.app_settings import (
    RegisterSerializer,
    register_permission_classes,
)

sensitive_post_parameters_m = method_decorator(
    sensitive_post_parameters(
        "password", "old_password", "new_password1", "new_password2"
    )
)


class LoginView(GenericAPIView):
    """
    Check the credentials and return the REST Token
    if the credentials are valid and authenticated.
    Calls Django Auth login method to register User ID
    in Django session framework

    Accept the following POST parameters: username, password
    Return the REST Framework Token Object's key.
    """

    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    token_model = TokenModel

    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super(LoginView, self).dispatch(*args, **kwargs)

    def process_login(self):
        django_login(self.request, self.user)

    def get_response_serializer(self):
        if getattr(settings, "REST_USE_JWT", False):
            response_serializer = JWTSerializer
        else:
            response_serializer = TokenSerializer
        return response_serializer

    def login(self):
        self.user = self.serializer.validated_data["user"]

        if getattr(settings, "REST_USE_JWT", False):
            self.token = jwt_encode(self.user)
        else:
            self.token = create_token(self.token_model, self.user, self.serializer)

        if getattr(settings, "REST_SESSION_LOGIN", True):
            self.process_login()

    def get_response(self):
        serializer_class = self.get_response_serializer()

        if getattr(settings, "REST_USE_JWT", False):
            data = {"user": self.user, "token": self.token}
            serializer = serializer_class(
                instance=data, context={"request": self.request}
            )
        else:
            serializer = serializer_class(
                instance=self.token, context={"request": self.request}
            )
        resp = {"success": True, "data": serializer.data}
        response = Response(resp, status=status.HTTP_200_OK)
        if getattr(settings, "REST_USE_JWT", False):
            from rest_framework_jwt.settings import api_settings as jwt_settings

            if jwt_settings.JWT_AUTH_COOKIE:
                from datetime import datetime

                expiration = datetime.utcnow() + jwt_settings.JWT_EXPIRATION_DELTA
                response.set_cookie(
                    jwt_settings.JWT_AUTH_COOKIE,
                    self.token,
                    expires=expiration,
                    httponly=True,
                )
        return response

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(
            data=self.request.data, context={"request": request}
        )

        if not self.serializer.is_valid():
            resp = {"success": False, "message": self.serializer.errors, "status": 401}
            return Response(resp, status=status.HTTP_401_UNAUTHORIZED)
        else:
            self.login()
            return self.get_response()


class LogoutView(APIView):
    """
    Calls Django logout method and delete the Token object
    assigned to the current User object.

    Accepts/Returns nothing.
    """

    permission_classes = (AllowAny,)

    def get(self, request, *args, **kwargs):
        if getattr(settings, "ACCOUNT_LOGOUT_ON_GET", False):
            response = self.logout(request)
        else:
            response = self.http_method_not_allowed(request, *args, **kwargs)

        return self.finalize_response(request, response, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.logout(request)

    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            pass
        if getattr(settings, "REST_SESSION_LOGIN", True):
            django_logout(request)

        response = Response(
            {"success": True, "data": _("Successfully logged out.")},
            status=status.HTTP_200_OK,
        )
        if getattr(settings, "REST_USE_JWT", False):
            from rest_framework_jwt.settings import api_settings as jwt_settings

            if jwt_settings.JWT_AUTH_COOKIE:
                response.delete_cookie(jwt_settings.JWT_AUTH_COOKIE)
        return response


class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = register_permission_classes()
    token_model = TokenModel

    @sensitive_post_parameters_m
    def dispatch(self, *args, **kwargs):
        return super(RegisterView, self).dispatch(*args, **kwargs)

    def get_response_data(self, user):
        if (
            allauth_settings.EMAIL_VERIFICATION
            == allauth_settings.EmailVerificationMethod.MANDATORY
        ):
            return {"detail": _("Verification e-mail sent.")}

        if getattr(settings, "REST_USE_JWT", False):
            data = {"user": user, "token": self.token}
            return JWTSerializer(data).data
        else:
            return TokenSerializer(user.auth_token).data

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            resp = {"success": False, "message": serializer.errors, "status": 422}
            return Response(resp, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            user = self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            resp = {"success": True, "data": self.get_response_data(user)}
            return Response(resp, status=status.HTTP_201_CREATED, headers=headers,)

    def perform_create(self, serializer):
        user = serializer.save(self.request)
        if getattr(settings, "REST_USE_JWT", False):
            self.token = jwt_encode(user)
        else:
            create_token(self.token_model, user, serializer)

        complete_signup(
            self.request._request, user, allauth_settings.EMAIL_VERIFICATION, None
        )
        return user


class UserDetailsView(RetrieveUpdateAPIView):
    """
    Reads and updates UserModel fields
    Accepts GET, PUT, PATCH methods.

    Default accepted fields: username, first_name, last_name
    Default display fields: pk, username, email, first_name, last_name
    Read-only fields: pk, email

    Returns UserModel fields.
    """

    serializer_class = UserDetailsSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user
