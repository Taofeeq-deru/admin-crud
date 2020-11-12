from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=50, blank=False)
    desc = models.TextField(max_length=2500, blank=True)
    price = models.IntegerField(blank=False)
    stock = models.IntegerField(blank=False)
    image = models.ImageField(upload_to="images", blank=True)

