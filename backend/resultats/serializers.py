from rest_framework import serializers
from .models import Resultat
from django.db.models import Q
from patients.models import Patient


class ResultatSerializer(serializers.ModelSerializer):
    examen_nom = serializers.CharField(source='examen.nom_examen', read_only=True)
    examen_type = serializers.CharField(source='examen.type_examen', read_only=True)
    patient_nom = serializers.CharField(source='examen.consultation.patient.nom', read_only=True)
    patient_prenom = serializers.CharField(source='examen.consultation.patient.prenom', read_only=True)

    class Meta:
        model = Resultat
        fields = [
            'id', 'examen', 'examen_nom', 'examen_type',
            'patient_nom', 'patient_prenom',
            'date_resultat', 'contenu', 'conclusion', 'est_normal','est_actif',
            'date_creation', 'date_modification'
        ]
        read_only_fields = ['date_creation', 'date_modification']

    def validate(self, data):
        request = self.context.get('request')
        examen = data.get('examen')

        if request and examen:
            mes_patients = Patient.objects.filter(
                Q(medecin_generaliste=request.user) | Q(medecin_actuel=request.user)
            )
            if examen.consultation.patient not in mes_patients:
                raise serializers.ValidationError({
                    'examen': "Cet examen n'appartient pas à l'un de vos patients."
                })

        date_resultat = data.get('date_resultat')
        if examen and date_resultat:
            if date_resultat < examen.date_prescription:
                raise serializers.ValidationError({
                    'date_resultat': "La date du résultat ne peut pas être avant la date de prescription."
                })

        return data