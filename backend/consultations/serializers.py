from rest_framework import serializers
from datetime import date
from .models import Consultation


class ConsultationsSerializer(serializers.ModelSerializer):
    patient_nom=serializers.CharField(source='patient.nom' , read_only=True)
    patient_prenom=serializers.CharField(source='patient.prenom' , read_only=True)

    class Meta:
        model=Consultation
        fields=[
            'id', 'patient','patient_nom','patient_prenom',
            'date_consultation', 'motif', 'diagnostic',
            'traitement','observations',
            'date_creation','date_modification'
        ]
        read_only_fields=['date creation', 'date_modification']
    def validate_date_consultation(self, value):
        if value > date.today():
            raise serializers.ValidationError("La date de consultation ne peut pas etre dans le futur")
        return value
    
    def validate_motif(self, value):
        if len(value.strip())< 5:
            raise serializers.ValidationError("Le motif doit etre plus detaille (minimum 5 caracteres)")
        return value
    
    def validate(self, data):
        request=self.context.get('request')
        patient=data.get('patient')
        if request and patient:
            if patient.personnel_medical!=request.user:
                raise serializers.ValidationError('Vous ne pouvez creer une consultaion que pour vos propres patients')
            return data