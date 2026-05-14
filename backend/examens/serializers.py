from rest_framework import serializers
from datetime import date
from .models import Examen

class ExamenSerializer(serializers.ModelSerializer):
    patient_nom=serializers.CharField(source='consultation.patient.nom', read_only=True)
    pattient_prenom=serializers.CharField(source='consultation.patient.nom', read_only=True)
    consultation_date=serializers.DateField(source='consultation.date_consultation', read_only=True)

    class Meta:
        model=Examen
        fields=[
            'id', 'consultation', 'patient_nom', 'patient_prenom',
            'consultation_date', 'type_examen', 'nom_examen',
            'date_prescription', 'date_realisation',
            'laboratoire', 'notes', 'date_creation' 
        ]
        read_only_fields=['date_creation']