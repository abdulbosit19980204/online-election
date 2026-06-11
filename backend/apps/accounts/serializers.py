from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()





class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'role', 'is_verified', 'wallet_address')
        read_only_fields = ('id', 'role', 'is_verified')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    wallet_address = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'wallet_address')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role='voter',
            wallet_address=validated_data.get('wallet_address')
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add custom claims
        data['user'] = UserSerializer(self.user).data
        return data
