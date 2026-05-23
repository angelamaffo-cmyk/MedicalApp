from rest_framework import serializers
from datetime import date
from django.contrib.auth.models import User
from .models import Patient , AssignationInfirmier, AssignationMedecin, Soin
from comptes.models import ProfilUtilisateur

class PatientSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    medecin_generaliste_nom = serializers.CharField(source='medecin_generaliste.get_full_name', read_only=True)
    medecin_actuel_nom = serializers.SerializerMethodField()
    
    class Meta:
        model = Patient
        fields = [
            'id', 'nom', 'prenom', 'sexe', 'date_naissance', 'age',
            'telephone', 'adresse', 'groupe_sanguin',
            'contact_urgence_nom', 'contact_urgence_telephone','medecin_generaliste', 
            'medecin_generaliste_nom', 'medecin_actuel' , 'medecin_actuel_nom','est_actif',
            'date_enregistrement', 'date_modification'
        ]
        read_only_fields = ['date_enregistrement', 'date_modification']
        extra_kwargs = {
            'medecin_actuel': {'required': False, 'allow_null': True}
        }


    def get_age(self, obj):
        today = date.today()
        age = today.year - obj.date_naissance.year
        if (today.month, today.day) < (obj.date_naissance.month, obj.date_naissance.day):
            age -= 1
        return age
    
    def get_medecin_actuel_nom(self, obj):
        if obj.medecin_actuel:
            return obj.medecin_actuel.get_full_name()
        return None
  

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
class SoinSerializer(serializers.ModelSerializer):
    infirmier_nom = serializers.CharField(source='infirmier.get_full_name', read_only=True)

    class Meta:
        model = Soin
        fields = ['id', 'assignation', 'infirmier', 'infirmier_nom', 'description', 'observations', 'date_soin']
        read_only_fields = ['infirmier', 'date_soin']
class AssignationInfirmierSerializer(serializers.ModelSerializer):
    infirmier_nom = serializers.CharField(source='infirmier.get_full_name', read_only=True)
    patient_nom = serializers.CharField(source='patient.nom', read_only=True)
    patient_prenom = serializers.CharField(source='patient.prenom', read_only=True)
    medecin_nom = serializers.CharField(source='medecin.get_full_name', read_only=True)
    soins = SoinSerializer(many=True, read_only=True)

    class Meta:
        model = AssignationInfirmier
        fields = [
            'id', 'patient', 'patient_nom', 'patient_prenom',
            'medecin', 'medecin_nom', 'infirmier', 'infirmier_nom',
            'soins_a_faire', 'date_debut', 'date_fin', 'est_active',
            'soins', 'date_creation'
        ]
        read_only_fields = ['medecin', 'date_creation']

class AssignationMedecinSerializer(serializers.ModelSerializer):
    medecin_cible_nom = serializers.CharField(source='medecin_cible.get_full_name', read_only=True)
    medecin_source_nom = serializers.CharField(source='medecin_source.get_full_name', read_only=True)
    patient_nom = serializers.CharField(source='patient.nom', read_only=True)
    patient_prenom = serializers.CharField(source='patient.prenom', read_only=True)


    class Meta:
        model = AssignationMedecin
        fields = [
            'id', 'patient', 
            'medecin_cible', 'medecin_cible_nom',
            'medecin_source', 'medecin_source_nom',
            'patient_nom', 'patient_prenom',
            'motif', 'service', 'date_assignation', 'est_active'
        ]
        read_only_fields = ['medecin_source', 'date_assignation']


    