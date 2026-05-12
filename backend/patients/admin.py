from django.contrib import admin

# Register your models here.
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    # Colonnes affichées dans la liste
    list_display = ['nom', 'prenom', 'sexe', 'date_naissance', 'groupe_sanguin', 'telephone', 'personnel_medical', 'date_enregistrement']

    # Filtres sur le côté droit
    list_filter = ['sexe', 'groupe_sanguin', 'personnel_medical']

    # Barre de recherche
    search_fields = ['nom', 'prenom', 'telephone']

    # Champs en lecture seule
    readonly_fields = ['date_enregistrement', 'date_modification']

    # Organisation du formulaire d'édition
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('nom', 'prenom', 'sexe', 'date_naissance', 'groupe_sanguin')
        }),
        ('Coordonnées', {
            'fields': ('telephone', 'adresse')
        }),
        ('Contact d\'urgence', {
            'fields': ('contact_urgence_nom', 'contact_urgence_telephone'),
            'classes': ('collapse',)
        }),
        ('Informations système', {
            'fields': ('personnel_medical', 'date_enregistrement', 'date_modification'),
            'classes': ('collapse',)
        }),
    )