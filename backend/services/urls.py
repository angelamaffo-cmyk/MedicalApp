from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, LitViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'lits', LitViewSet, basename='lit')

urlpatterns = [
    path('', include(router.urls)),
]