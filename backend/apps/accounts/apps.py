from django.apps import AppConfig
from django.conf import settings
from django.db.models.signals import post_migrate

def create_default_admin(sender, **kwargs):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    email = settings.FIRST_ADMIN_EMAIL
    password = settings.FIRST_ADMIN_PASSWORD
    
    if email and password:
        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(
                email=email,
                password=password,
                full_name="System Admin"
            )
            print(f"Created default admin: {email}")

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.accounts'

    def ready(self):
        post_migrate.connect(create_default_admin, sender=self)
