from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Examen
from .serializers import ExamenSerializer
from django.db import models

from django.db.models import Q

def get_role(user):
    """Retourne le rôle de l'utilisateur"""
    if user.is_superuser or user.is_staff:
        return 'ADMIN'
    try:
        return user.profil.role
    except:
        return 'ADMIN'

class ExamenViewSet(viewsets.ModelViewSet):
    serializer_class = ExamenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)

        if role == 'ADMIN':
            # Admin voit tout
            return Examen.objects.all()
        elif role == 'INFIRMIER':
            # Infirmier voit tous les patients
            return Examen.objects.all()
        else:
            # Médecin voit uniquement ses patients
            # (ceux qu'il a créés + ceux qui lui sont assignés)
            return Examen.objects.filter(
                models.Q(consultation__patient__personnel_medical=user) |
                models.Q(consultation__patient__medecin_responsable=user)
            ).distinct()
    

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context