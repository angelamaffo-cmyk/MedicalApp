from django.shortcuts import render
from rest_framework import viewsets
from .models import Consultation
from rest_framework.permissions import IsAuthenticated
from .serializers import ConsultationsSerializer
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
    queryset = Consultation.objects.all()

    serializer_class=ConsultationsSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)

        if role == 'ADMIN':
            # Admin voit tout
            return Consultation.objects.all()
        elif role == 'INFIRMIER':
            # Infirmier voit tous les patients
            return Consultation.objects.all()
        else:
            # Médecin voit uniquement ses patients
            # (ceux qu'il a créés + ceux qui lui sont assignés)
            return Consultation.objects.filter(
                models.Q(patient__personnel_medical=user) |
                models.Q(patient__medecin_responsable=user)
            ).distinct()
    
    def get_serializer_context(self):
        context=super().get_serializer_context()
        context['request']=self.request
        return context
