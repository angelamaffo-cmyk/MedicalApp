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
python manage.py shell -c "
from django.contrib.auth.models import User
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@medtrack.com', 'MedTrack2026')
    print("Superuser créé!")
else:
    print("Superuser existe déjà.")
"
