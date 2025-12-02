from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Avoids clash
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',  # Avoids clash
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.email
