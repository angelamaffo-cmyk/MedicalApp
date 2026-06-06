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
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medtrack_api.settings')
django.setup()
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin2@medtrack.com', 'VotreMotDePasseIci123')
    print('Superuser cree avec succes')
else:
    print('Le superuser existe deja')
"

