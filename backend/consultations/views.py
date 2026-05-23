from django.shortcuts import render
from rest_framework import viewsets
from .models import Consultation
from rest_framework.permissions import IsAuthenticated
from .serializers import ConsultationsSerializer
from patients.models import Patient, AssignationInfirmier, AssignationMedecin, Soin

from django.db import models

from django.db.models import Q

# Create your views here.
def get_role(user):
    """Retourne le rôle de l'utilisateur"""
    if user.is_superuser or user.is_staff:
        return 'ADMIN'
    try:
        return user.profil.role
    except:
        return 'ADMIN'
    

class ConsultationViewSet(viewsets.ModelViewSet):
   

    serializer_class=ConsultationsSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)

        if role == 'ADMIN':
            return Consultation.objects.all()
        elif role == 'INFIRMIER':
            return Consultation.objects.none()  # Infirmier ne voit pas les consultations

        else:
            return Consultation.objects.filter(
                Q(patient__medecin_generaliste=user) |
                Q(patient__medecin_actuel=user)
            ).filter(
                patient__in=self._get_mes_patients(user)
            ).distinct()
        
    def _get_mes_patients(self, user):
        from patients.models import Patient
        return Patient.objects.filter(
            Q(medecin_generaliste=user) | Q(medecin_actuel=user)
        )
    
    def get_serializer_context(self):
        context=super().get_serializer_context()
        context['request']=self.request
        return context
    
    def perform_create(self, serializer):
        serializer.save()