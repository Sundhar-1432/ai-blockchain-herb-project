from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework import serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer

class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created"}, status=201)

        return Response(serializer.errors, status=400)

# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'role']
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }
#
#     def create(self, validated_data):
#         user = User.objects.create_user(
#             username=validated_data['username'],
#             email=validated_data['email'],
#             password=validated_data['password'],
#             role=validated_data['role']
#         )
#         return user

# class CustomTokenSerializer(TokenObtainPairSerializer):

#     def validate(self, attrs):
#         data = super().validate(attrs)
#         data['role'] = self.user.role        data['name'] = self.user.first_name or self.user.username#         return data
class CustomTokenSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['name'] = self.user.first_name or self.user.username
        return data


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer

# class LoginView(APIView):
#     def post(self, request):
#         user = authenticate(
#             username=request.data.get("username"),
#             password=request.data.get("password")
#         )
#
#         if user is None:
#             return Response({"error": "Invalid credentials"}, status=400)
#
#         refresh = RefreshToken.for_user(user)
#
#         return Response({
#             "access": str(refresh.access_token),
#             "refresh": str(refresh),
#             "role": user.role,
#             "name": user.first_name if user.first_name else user.username,
#         })
