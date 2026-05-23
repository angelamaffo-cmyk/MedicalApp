from django.shortcuts import render
from django.db import models
# Create your views here.
from django.db.models import Q

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Patient, AssignationInfirmier, AssignationMedecin, Soin
from .serializers import PatientSerializer
from comptes.models import ProfilUtilisateur
from .serializers import (PatientSerializer, AssignationMedecinSerializer, AssignationInfirmierSerializer, SoinSerializer)


def get_role(user):
    """Retourne le rôle de l'utilisateur"""
    if user.is_superuser or user.is_staff:
        return 'ADMIN'
    try:
        return user.profil.role
    except:
        return 'ADMIN'
    
def est_generaliste(user):
    try:
        return user.profil.specialite == 'Medecine Generale'
    except:
        return False



class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)

        if role == 'ADMIN':
            return Patient.objects.all()
        elif role == 'INFIRMIER':
            ids = AssignationInfirmier.objects.filter( infirmier=user, est_active=True
                ).values_list('patient_id', flat=True)
            return Patient.objects.filter(id__in=ids)
        else:
            return Patient.objects.filter(
                Q(medecin_generaliste=user) |
                Q(medecin_actuel=user)
            ).distinct()
        
    def perform_create(self, serializer):
        serializer.save(mdecin_generaliste=self.request.user)

    def create(self, request, *args, **kwargs):
        role = get_role(request.user)
        if role != 'MEDECIN' or not est_generaliste(request.user):
            return Response(
                {"detail": "Seul le médecin généraliste peut créer un patient."},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
class AssignationMedecinViewSet(viewsets.ModelViewSet):
    serializer_class = AssignationMedecinSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)
        if role == 'ADMIN':
            return AssignationMedecin.objects.all()
        return AssignationMedecin.objects.filter(
            Q(medecin_source=user) | Q(medecin_cible=user)
        )
    
    def perform_create(self, serializer):
        patient = serializer.validated_data['patient']
        medecin_cible = serializer.validated_data['medecin_cible']
        # Mettre à jour le médecin actuel du patient
        patient.medecin_actuel = medecin_cible
        patient.save()
        serializer.save(medecin_source=self.request.user)
class AssignationInfirmierViewSet(viewsets.ModelViewSet):
    serializer_class = AssignationInfirmierSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)
        if role == 'ADMIN':
            return AssignationInfirmier.objects.all()
        elif role == 'INFIRMIER':
            return AssignationInfirmier.objects.filter(infirmier=user)
        else:
            return AssignationInfirmier.objects.filter(medecin=user)

    def perform_create(self, serializer):
        serializer.save(medecin=self.request.user)
class SoinViewSet(viewsets.ModelViewSet):
    serializer_class = SoinSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        role = get_role(user)
        if role == 'ADMIN':
            return Soin.objects.all()
        elif role == 'INFIRMIER':
            return Soin.objects.filter(infirmier=user)
        else:
            # Médecin voit les soins de ses patients
            ids = AssignationInfirmier.objects.filter(medecin=user).values_list('id', flat=True)
            return Soin.objects.filter(assignation_id__in=ids)

    def perform_create(self, serializer):
        serializer.save(infirmier=self.request.user)