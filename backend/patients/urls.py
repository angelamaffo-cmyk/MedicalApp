from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, AssignationMedecinViewSet, AssignationInfirmierViewSet, SoinViewSet 

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'assignations-medecin', AssignationMedecinViewSet, basename='assignation-medecin')
router.register(r'assignations-infirmier', AssignationInfirmierViewSet, basename='assignation-infirmier')
router.register(r'soins', SoinViewSet, basename='soin')

urlpatterns = [
    path('', include(router.urls)),
]