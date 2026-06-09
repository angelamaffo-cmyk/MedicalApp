from django.shortcuts import render
from django.db import models
# Create your views here.
from django.db.models import Q
from django.core.mail import send_mail
from django.conf import settings

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
        return user.profil.specialite == 'Médecine Générale'
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
        serializer.save(medecin_generaliste=self.request.user)

    
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
        medecin_source = self.request.user
        motif = serializer.validated_data.get('motif', 'Non spécifié')
        service = serializer.validated_data.get('service', 'Non spécifié')
        # Mettre à jour le médecin actuel du patient
        patient.medecin_actuel = medecin_cible
        patient.save()
        serializer.save(medecin_source=medecin_source)
        if settings.DEBUG:

            if medecin_cible.email:
                sujet = f"[ANGELYS] Nouveau patient assigné : {patient.nom} {patient.prenom}"
                message = (
                f"Bonjour Dr. {medecin_cible.last_name},\n\n"
                f"Le Dr. {medecin_source.get_full_name()} vous a assigné un nouveau patient.\n\n"
                f"Détails du Patient :\n"
                f"- Nom complet : {patient.nom} {patient.prenom}\n"
                f"- Sexe : {patient.get_sexe_display()}\n"
                f"- Service concerné : {service}\n"
                f"- Motif de l'assignation : {motif}\n\n"
                f"Connectez-vous a la plateforme pour consulter son dossier médical.\n\n"
                f"Cordialement,\nL'équipe ANGELYS."
                )
                try:
                    send_mail(
                    subject=sujet,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[medecin_cible.email],
                    fail_silently=True # Évite de faire planter l'API Angular si l'envoi échoue
                    )
                except Exception as e:
                    print(f"Erreur d'envoi d'email médecin: {e}")
            else:
                print(f"[Production Render] Assignation Médecin réussie en base pour le patient {patient.nom}. Envoi d'email ignoré.")

                


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
        patient = serializer.validated_data['patient']
        infirmier = serializer.validated_data['infirmier']
        medecin = self.request.user
        soins_a_faire = serializer.validated_data.get('soins_a_faire', '')

        # 1. Sauvegarder l'assignation
        serializer.save(medecin=medecin)

        if settings.DEBUG:

            if infirmier.email:
                sujet = f"[ANGELYS] Nouvelle prise en charge : {patient.nom} {patient.prenom}"
                message = (
                f"Bonjour {infirmier.get_full_name()},\n\n"
                f"Le Dr. {medecin.get_full_name()} vous a confié des soins pour un patient.\n\n"
                f"Détails de la prise en charge :\n"
                f"- Patient : {patient.nom} {patient.prenom}\n"
                f"- Soins à prodiguer : {soins_a_faire}\n"
                f"- Date de début : {serializer.validated_data.get('date_debut')}\n"
                f"- Date de fin : {serializer.validated_data.get('date_fin')}\n\n"
                f"Veuillez vous connecter sur la plateforme pour valider et enregistrer vos observations après administration des soins.\n\n"
                f"Cordialement,\nL'équipe ANGELYS."
                )
                try:

                    send_mail(
                    subject=sujet,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[infirmier.email],
                    fail_silently=True
                    )
                except Exception as e:
                    print(f"Erreur d'envoi d'email infirmier: {e}")
            else:
                print(f"[Production Render] Assignation Infirmier réussie en base pour le patient {patient.nom}. Envoi d'email ignoré.")


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