from django.shortcuts import render
from .models import Product
from .serializers import ProductSerializer
from django.http import Http404
from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class ProductList(APIView):
    def get(self, request, format=None):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        new_list = serializer.data[::-1]
        resp = {"success": True, "data": new_list}
        return Response(resp)

    def post(self, request, format=None):
        if request.user and not request.user.is_authenticated:
            resp = {
                "success": False,
                "message": NotAuthenticated.default_detail,
                "status": NotAuthenticated.status_code,
            }
            return Response(resp, status=NotAuthenticated.status_code)

        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            products = Product.objects.all()
            all_serializer = ProductSerializer(products, many=True)
            new_list = all_serializer.data[::-1]
            resp = {"success": True, "data": new_list}

            return Response(resp, status=status.HTTP_201_CREATED)
        respo = {
            "success": False,
            "message": serializer.errors,
            "status": "400",
        }
        return Response(respo, status=status.HTTP_400_BAD_REQUEST)


class ProductDetail(APIView):
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        resp = {"success": True, "data": serializer.data}
        return Response(resp)

    def put(self, request, pk, format=None):
        if request.user and not request.user.is_authenticated:
            resp = {
                "success": False,
                "message": NotAuthenticated.default_detail,
                "status": NotAuthenticated.status_code,
            }
            return Response(resp, status=NotAuthenticated.status_code)
        elif request.user.is_authenticated and not request.user.is_staff:
            resp = {
                "success": False,
                "message": PermissionDenied.default_detail,
                "status": PermissionDenied.status_code,
            }
            return Response(resp, status=PermissionDenied.status_code)

        product = self.get_object(pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            products = Product.objects.all()
            all_serializer = ProductSerializer(products, many=True)
            new_list = all_serializer.data[::-1]
            resp = {"success": True, "data": new_list}
            return Response(resp)
        respo = {"success": False, "message": serializer.errors, "status": "400"}
        return Response(respo, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        if request.user and not request.user.is_authenticated:
            resp = {
                "success": False,
                "message": NotAuthenticated.default_detail,
                "status": NotAuthenticated.status_code,
            }
            return Response(resp, status=NotAuthenticated.status_code)
        elif request.user.is_authenticated and not request.user.is_staff:
            resp = {
                "success": False,
                "message": PermissionDenied.default_detail,
                "status": PermissionDenied.status_code,
            }
            return Response(resp, status=PermissionDenied.status_code)

        product = self.get_object(pk)
        product.delete()
        products = Product.objects.all()
        all_serializer = ProductSerializer(products, many=True)
        new_list = all_serializer.data[::-1]
        resp = {"success": True, "data": new_list}
        return Response(resp)

