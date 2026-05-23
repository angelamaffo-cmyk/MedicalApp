from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from .models import ProfilUtilisateur

MOT_DE_PASSE_DEFAUT = "MedTrack2026"

class CreerCompteSerializer(serializers.ModelSerializer):
    # Champs de l'utilisateur
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=['MEDECIN', 'INFIRMIER'])
    telephone = serializers.CharField(required=False, allow_blank=True)
    specialite = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'role', 'telephone', 'specialite']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Un compte avec cet email existe déjà.")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role')
        telephone = validated_data.pop('telephone', '')
        specialite = validated_data.pop('specialite', '')

        # Créer le username à partir de l'email
        username = validated_data['email'].split('@')[0]
        # S'assurer que le username est unique
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        # Créer l'utilisateur avec mot de passe par défaut
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=MOT_DE_PASSE_DEFAUT
        )

        # Créer le profil
        ProfilUtilisateur.objects.create(
            utilisateur=user,
            role=role,
            telephone=telephone,
            specialite=specialite,
            premiere_connexion=True
        )

        # Envoyer l'email
    try:
        send_mail(
            subject="Bienvenue sur MedTrack — Vos identifiants de connexion",
            message=f"""
            Bonjour {user.first_name} {user.last_name},

Votre compte MedTrack a été créé avec succès.

Vos identifiants de connexion :
    - Nom d'utilisateur : {username}
    - Mot de passe : {MOT_DE_PASSE_DEFAUT}

Veuillez vous connecter et changer votre mot de passe dès votre première connexion.

Cordialement,
L'équipe MedTrack
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
    except Exception:
        pass

        


class ChangerMotDePasseSerializer(serializers.Serializer):
    ancien_mot_de_passe = serializers.CharField()
    nouveau_mot_de_passe = serializers.CharField(min_length=8)
    confirmer_mot_de_passe = serializers.CharField()

    def validate(self, data):
        if data['nouveau_mot_de_passe'] != data['confirmer_mot_de_passe']:
            raise serializers.ValidationError({
                'confirmer_mot_de_passe': "Les deux mots de passe ne correspondent pas."
            })
        return data


class ProfilSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='utilisateur.username', read_only=True)
    email = serializers.CharField(source='utilisateur.email', read_only=True)
    nom_complet = serializers.CharField(source='utilisateur.get_full_name', read_only=True)
    premiere_connexion = serializers.BooleanField(read_only=True)
    utilisateur_id = serializers.IntegerField(source='utilisateur.id', read_only=True)

    class Meta:
        model = ProfilUtilisateur
        fields = ['id', 'utilisateur_id','username', 'email',
                   'nom_complet', 'role', 'telephone', 'specialite',
                     'premiere_connexion', 'est_actif']