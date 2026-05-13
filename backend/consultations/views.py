from django.shortcuts import render
from rest_framework import viewsets
from .models import Consultation
from rest_framework.permissions import IsAuthenticated
from .serializers import ConsultationsSerializer

# Create your views here.
class ConsultationViewSet(viewsets.ModelViewSet):
    serializer_class=ConsultationsSerializer
    permission_classes=[IsAuthenticated]

    def get_query(self):
        return Consultation.objects.filter( patient__personnel_medical=self.request.user)
    
    def get_serializer_context(self):
        context=super().get_serializer_context()
        context['request']=self.request
        return context
