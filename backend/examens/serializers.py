from rest_framework import serializers
from datetime import date
from .models import Examen


class ExamenSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='consultation.patient.nom', read_only=True)
    patient_prenom = serializers.CharField(source='consultation.patient.prenom', read_only=True)
    consultation_date = serializers.DateField(source='consultation.date_consultation', read_only=True)

    class Meta:
        model = Examen
        fields = [
            'id', 'consultation', 'patient_nom', 'patient_prenom',
            'consultation_date', 'type_examen', 'nom_examen',
            'date_prescription', 'date_realisation',
            'laboratoire', 'notes', 'date_creation'
        ]
        read_only_fields = ['date_creation']

    def validate(self, data):
        request = self.context.get('request')
        consultation = data.get('consultation')

        if request and consultation:
            if consultation.patient.personnel_medical != request.user:
                raise serializers.ValidationError({
                    'consultation': "Cette consultation n'appartient pas à l'un de vos patients."
                })

        date_prescription = data.get('date_prescription')
        date_realisation = data.get('date_realisation')

        if date_prescription and date_realisation:
            if date_realisation < date_prescription:
                raise serializers.ValidationError({
                    'date_realisation': "La date de réalisation ne peut pas être avant la date de prescription."
                })

        return data