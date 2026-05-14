from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Hospitalisation, Observation
from .serializers import HospitalisationSerializer, ObservationSerializer
from comptes.models import ProfilUtilisateur


class HospitalisationViewSet(viewsets.ModelViewSet):
    serializer_class = HospitalisationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Hospitalisation.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        """Seul un médecin peut admettre un patient"""
        try:
            profil = request.user.profil
            if profil.role != 'MEDECIN':
                return Response(
                    {"detail": "Seul un médecin peut admettre un patient."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except ProfilUtilisateur.DoesNotExist:
            pass
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(medecin_responsable=self.request.user)

    @action(detail=False, methods=['get'])
    def en_cours(self, request):
        """Liste des hospitalisations en cours"""
        hospitalisations = Hospitalisation.objects.filter(statut='EN_COURS')
        serializer = self.get_serializer(hospitalisations, many=True)
        return Response(serializer.data)


class ObservationViewSet(viewsets.ModelViewSet):
    serializer_class = ObservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Observation.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(auteur=self.request.user)