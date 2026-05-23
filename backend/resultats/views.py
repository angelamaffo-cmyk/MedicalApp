from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Resultat
from patients.models import Patient

from .serializers import ResultatSerializer
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

class ResultatViewSet(viewsets.ModelViewSet):
    serializer_class = ResultatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)

        if role == 'ADMIN':
            # Admin voit tout
            return Resultat.objects.all()
        elif role == 'INFIRMIER':
            # Infirmier voit tous les patients
            return Resultat.objects.none()
        else:
            # Médecin voit uniquement ses patients
            # (ceux qu'il a créés + ceux qui lui sont assignés)
            mes_patients = Patient.objects.filter(
                Q(medecin_generaliste=user) | Q(medecin_actuel=user)
            )
            return Resultat.objects.filter(
                examen__consultation__patient__in=mes_patients
            ).distinct()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context