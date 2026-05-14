from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import ProfilUtilisateur
from .serializers import CreerCompteSerializer, ChangerMotDePasseSerializer, ProfilSerializer


class CreerCompteView(APIView):
    """Seul l'admin peut créer des comptes"""
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = CreerCompteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Compte créé avec succès. Un email a été envoyé."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListePersonnelView(APIView):
    """L'admin peut voir tout le personnel"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        profils = ProfilUtilisateur.objects.all()
        serializer = ProfilSerializer(profils, many=True)
        return Response(serializer.data)


class ChangerMotDePasseView(APIView):
    """Changer son mot de passe — accessible à tout utilisateur connecté"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangerMotDePasseSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user

            # Vérifier l'ancien mot de passe
            if not user.check_password(serializer.validated_data['ancien_mot_de_passe']):
                return Response(
                    {"ancien_mot_de_passe": "Mot de passe incorrect."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Changer le mot de passe
            user.set_password(serializer.validated_data['nouveau_mot_de_passe'])
            user.save()

            # Marquer que ce n'est plus la première connexion
            if hasattr(user, 'profil'):
                user.profil.premiere_connexion = False
                user.profil.save()

            return Response(
                {"message": "Mot de passe changé avec succès."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MonProfilView(APIView):
    """Voir son propre profil"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profil = request.user.profil
            serializer = ProfilSerializer(profil)
            return Response(serializer.data)
        except ProfilUtilisateur.DoesNotExist:
            return Response(
                {"message": "Profil non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )


class DesactiverCompteView(APIView):
    """L'admin peut désactiver un compte"""
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            profil = ProfilUtilisateur.objects.get(utilisateur__id=user_id)
            profil.est_actif = False
            profil.save()
            profil.utilisateur.is_active = False
            profil.utilisateur.save()
            return Response({"message": "Compte désactivé avec succès."})
        except ProfilUtilisateur.DoesNotExist:
            return Response(
                {"message": "Utilisateur non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )