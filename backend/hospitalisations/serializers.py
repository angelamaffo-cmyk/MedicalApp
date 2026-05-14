from rest_framework import serializers
from .models import Hospitalisation, Observation
from services.models import Lit


class ObservationSerializer(serializers.ModelSerializer):
    auteur_nom = serializers.CharField(source='auteur.get_full_name', read_only=True)

    class Meta:
        model = Observation
        fields = ['id', 'hospitalisation', 'auteur', 'auteur_nom', 'contenu', 'date_observation']
        read_only_fields = ['date_observation', 'auteur']

    def create(self, validated_data):
        validated_data['auteur'] = self.context['request'].user
        return super().create(validated_data)


class HospitalisationSerializer(serializers.ModelSerializer):
    patient_nom = serializers.CharField(source='patient.nom', read_only=True)
    patient_prenom = serializers.CharField(source='patient.prenom', read_only=True)
    lit_numero = serializers.CharField(source='lit.numero', read_only=True)
    service_nom = serializers.CharField(source='lit.service.nom', read_only=True)
    medecin_nom = serializers.CharField(source='medecin_responsable.get_full_name', read_only=True)
    observations = ObservationSerializer(many=True, read_only=True)

    class Meta:
        model = Hospitalisation
        fields = [
            'id', 'patient', 'patient_nom', 'patient_prenom',
            'lit', 'lit_numero', 'service_nom',
            'medecin_responsable', 'medecin_nom',
            'date_entree', 'date_sortie',
            'motif_admission', 'statut', 'motif_sortie',
            'observations', 'date_creation', 'date_modification'
        ]
        read_only_fields = ['date_creation', 'date_modification']

    def validate(self, data):
        lit = data.get('lit')
        statut = data.get('statut', 'EN_COURS')

        # Vérifier que le lit est disponible à l'admission
        if lit and statut == 'EN_COURS':
            if lit.statut == 'OCCUPE':
                raise serializers.ValidationError({
                    'lit': "Ce lit est déjà occupé."
                })
            if lit.statut == 'MAINTENANCE':
                raise serializers.ValidationError({
                    'lit': "Ce lit est en maintenance."
                })

        # Vérifier les dates
        date_entree = data.get('date_entree')
        date_sortie = data.get('date_sortie')
        if date_entree and date_sortie:
            if date_sortie < date_entree:
                raise serializers.ValidationError({
                    'date_sortie': "La date de sortie ne peut pas être avant la date d'entrée."
                })

        return data

    def create(self, validated_data):
        hospitalisation = super().create(validated_data)
        # Marquer le lit comme occupé
        lit = hospitalisation.lit
        lit.statut = 'OCCUPE'
        lit.save()
        return hospitalisation

    def update(self, instance, validated_data):
        hospitalisation = super().update(instance, validated_data)
        # Si le patient est sorti, libérer le lit
        if hospitalisation.statut in ['SORTI', 'TRANSFERE', 'DECEDE']:
            lit = hospitalisation.lit
            lit.statut = 'DISPONIBLE'
            lit.save()
        return hospitalisation