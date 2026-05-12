from rest_framework import serializers
from datetime import date
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id', 'nom', 'prenom', 'sexe', 'date_naissance', 'age',
            'telephone', 'adresse', 'groupe_sanguin',
            'contact_urgence_nom', 'contact_urgence_telephone',
            'date_enregistrement', 'date_modification'
        ]
        read_only_fields = ['date_enregistrement', 'date_modification']

    def get_age(self, obj):
        today = date.today()
        age = today.year - obj.date_naissance.year
        if (today.month, today.day) < (obj.date_naissance.month, obj.date_naissance.day):
            age -= 1
        return age

    def validate_date_naissance(self, value):
        if value >= date.today():
            raise serializers.ValidationError(
                "La date de naissance doit être dans le passé."
            )
        return value

    def validate_telephone(self, value):
        chiffres = ''.join(filter(str.isdigit, value))
        if len(chiffres) < 8:
            raise serializers.ValidationError(
                "Le numéro de téléphone doit contenir au moins 8 chiffres."
            )
        return value

    def validate(self, data):
        nom_urgence = data.get('contact_urgence_nom', '')
        tel_urgence = data.get('contact_urgence_telephone', '')
        if nom_urgence and not tel_urgence:
            raise serializers.ValidationError({
                'contact_urgence_telephone': "Le téléphone du contact d'urgence est requis si le nom est renseigné."
            })
        if tel_urgence and not nom_urgence:
            raise serializers.ValidationError({
                'contact_urgence_nom': "Le nom du contact d'urgence est requis si le téléphone est renseigné."
            })
        return data