from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Resultat
from .serializers import ResultatSerializer


class ResultatViewSet(viewsets.ModelViewSet):
    serializer_class = ResultatSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resultat.objects.filter(
            examen__consultation__patient__personnel_medical=self.request.user
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context