#!/usr/bin/env bash
# Arrêter le script immédiatement si une commande échoue
set -o errexit

# Installer les dépendances Python
pip install -r requirements.txt

# Collecter les fichiers statiques (Admin Django, etc.)
python manage.py collectstatic --no-input

# Appliquer les migrations de la base de données
python manage.py migrate

# Créer superuser automatiquement si il n'existe pas
# Création automatique du superutilisateur via un script Python inline sécurisé
# Création et mise à jour forcée du mot de passe administrateur
# Création automatique du compte selon la logique de votre application
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medtrack_api.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()

# Votre logique : username extrait de l'email, mot de passe par défaut 'MedTrack'
email_prod = 'angelatemgoua2@gmail.com'
username_prod = 'angelatemgoua2'

if not User.objects.filter(username=username_prod).exists():
    # On crée le compte avec le statut superuser pour que vous gardiez les droits d'accès partout
    user = User.objects.create_superuser(username=username_prod, email=email_prod)
    user.set_password('MedTrack')
    user.save()
    print('Compte de production cree avec succes selon vos regles !')
else:
    # Si le compte existe déjà, on force la réinitialisation du mot de passe à 'MedTrack' pour être sûr
    user = User.objects.get(username=username_prod)
    user.set_password('MedTrack')
    user.save()
    print('Compte existant mis a jour avec le mot de passe MedTrack')
"



