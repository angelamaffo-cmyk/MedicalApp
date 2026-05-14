from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Examen
from .serializers import ExamenSerializer


class ExamenViewSet(viewsets.ModelViewSet):
    serializer_class = ExamenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Examen.objects.filter(
            consultation__patient__personnel_medical=self.request.user
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context