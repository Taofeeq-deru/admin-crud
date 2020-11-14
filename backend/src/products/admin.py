from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Product

# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock", "image_tag")

    def image_tag(self, obj):
        if obj.image:
            return mark_safe(
                '<img src="%s" style="width: 45px; height:45px;" />' % obj.image.url
            )
        else:
            return "No Image Found"


admin.site.register(Product, ProductAdmin)
