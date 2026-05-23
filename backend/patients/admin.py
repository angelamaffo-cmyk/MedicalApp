from django.contrib import admin
from .models import Patient, AssignationMedecin, AssignationInfirmier, Soin


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['nom', 'prenom', 'sexe', 'groupe_sanguin', 'medecin_generaliste', 'medecin_actuel', 'est_actif']
    list_filter = ['sexe', 'groupe_sanguin', 'est_actif']
    search_fields = ['nom', 'prenom', 'telephone']
    readonly_fields = ['date_enregistrement', 'date_modification']


@admin.register(AssignationMedecin)
class AssignationMedecinAdmin(admin.ModelAdmin):
    list_display = ['patient', 'medecin_source', 'medecin_cible', 'service', 'date_assignation', 'est_active']
    list_filter = ['est_active']
    search_fields = ['patient__nom', 'medecin_cible__last_name']


@admin.register(AssignationInfirmier)
class AssignationInfirmierAdmin(admin.ModelAdmin):
    list_display = ['patient', 'medecin', 'infirmier', 'date_debut', 'date_fin', 'est_active']
    list_filter = ['est_active']
    search_fields = ['patient__nom', 'infirmier__last_name']


@admin.register(Soin)
class SoinAdmin(admin.ModelAdmin):
    list_display = ['assignation', 'infirmier', 'date_soin']
    list_filter = ['date_soin']
    search_fields = ['description', 'infirmier__last_name']