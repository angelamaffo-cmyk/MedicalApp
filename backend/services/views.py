from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Service, Lit
from .serializers import ServiceSerializer, LitSerializer


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(est_actif=True)
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Seul l'admin peut créer/modifier les services"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    @action(detail=True, methods=['get'])
    def lits_disponibles(self, request, pk=None):
        """Voir les lits disponibles d'un service"""
        service = self.get_object()
        lits = service.lits.filter(statut='DISPONIBLE', est_actif=True)
        serializer = LitSerializer(lits, many=True)
        return Response(serializer.data)


class LitViewSet(viewsets.ModelViewSet):
    queryset = Lit.objects.filter(est_actif=True)
    serializer_class = LitSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Seul l'admin peut créer/modifier les lits"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]