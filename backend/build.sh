#!/usr/bin/env bash
# Arrêter le script immédiatement si une commande échoue
set -o errexit

# Installer les dépendances Python
pip install -r requirements.txt

# Collecter les fichiers statiques (Admin Django, etc.)
python manage.py collectstatic --no-input

# Appliquer les migrations de la base de données
python manage.py migrate


