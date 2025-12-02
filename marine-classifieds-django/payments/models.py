from django.db import models
from users.models import User
from listings.models import Listing

class Payment(models.Model):
    PAYMENT_TYPE_CHOICES = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    stripe_id = models.CharField(max_length=255, blank=True, null=True)
    paypal_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email} - {self.amount} - {self.payment_type}'
