from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from .models import ProfilUtilisateur
from django.utils.html import strip_tags  


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

        MOT_DE_PASSE_DEFAUT = "MedTrack2026"
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


        # 1. Le design de ton e-mail en HTML et CSS inline
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f4f6f9;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 30px auto;
                    background: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    border: 1px solid #e1e8ed;
                }}
                .header {{
                    background-color: #0056b3;
                    color: #ffffff;
                    padding: 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }}
                .content {{
                    padding: 30px;
                    color: #495057;
                    line-height: 1.6;
                }}
                .welcome {{
                    font-size: 18px;
                    color: #1a1a1a;
                    font-weight: bold;
                    margin-bottom: 20px;
                }}
                .credentials-box {{
                    background-color: #f8f9fa;
                    border-left: 4px solid #0056b3;
                    padding: 20px;
                    margin: 25px 0;
                    border-radius: 4px;
                }}
                .credentials-item {{
                    margin: 8px 0;
                    font-size: 15px;
                }}
                .credentials-item strong {{
                    color: #212529;
                }}
                .btn-container {{
                    text-align: center;
                    margin: 30px 0 20px 0;
                }}
                .btn {{
                    background-color: #0056b3;
                    color: #ffffff !important;
                    text-decoration: none;
                    padding: 12px 30px;
                    font-size: 15px;
                    font-weight: 600;
                    border-radius: 5px;
                    display: inline-block;
                    box-shadow: 0 3px 6px rgba(0,86,179,0.2);
                }}
                .footer {{
                    background-color: #f8f9fa;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #6c757d;
                    border-top: 1px solid #eeeeee;
                }}
                .warning {{
                    font-size: 13px;
                    color: #dc3545;
                    background-color: #fff5f5;
                    padding: 10px;
                    border-radius: 4px;
                    margin-top: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>MedTrack</h1>
                </div>
                <div class="content">
                    <div class="welcome">Bienvenue sur la plateforme, {user.first_name} {user.last_name} !</div>
                    <p>Un administrateur vient de vous créer un accès sécurisé pour la gestion et le suivi des dossiers des patients.</p>
                    
                    <p>Voici vos identifiants de connexion provisoires :</p>
                    
                    <div class="credentials-box">
                        <div class="credentials-item"><strong>Nom d'utilisateur :</strong> {username}</div>
                        <div class="credentials-item"><strong>Mot de passe :</strong> <code>{MOT_DE_PASSE_DEFAUT}</code></div>
                    </div>
                    
                    <div class="btn-container">
                        <a href="http://localhost:4200" class="btn" target="_blank">Se connecter à MedTrack</a>
                    </div>
                    
                    <div class="warning">
                        <strong>Sécurité Médicale :</strong> Par mesure de confidentialité, vous serez invité à modifier ce mot de passe dès votre première connexion.
                    </div>
                </div>
                <div class="footer">
                    Ceci est un message automatique, merci de ne pas y répondre.<br>
                    &copy; 2026 MedTrack — Système de Gestion Hospitalière Securisée.
                </div>
            </div>
        </body>
        </html>
        """
        text_content = strip_tags(html_content)

        
       

        # Envoyer l'email
        try:
            send_mail(
                subject="Création de votre compte MedTrack — Identifiants sécurisés",
                message=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
                html_message=html_content,  # Permet d'afficher l'erreur dans le terminal si l'envoi échoue
            )
        except Exception as e:
            print(f"\n[ERREUR SMTP MEDTRACK] Impossible d'envoyer l'email à {user.email}. Détails : {e}\n")        

        return user
        


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