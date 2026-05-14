from django.contrib import admin

# Register your models here.

from .models import Hospitalisation, Observation


class ObservationInline(admin.TabularInline):
    model = Observation
    extra = 1
    readonly_fields = ['date_observation']


@admin.register(Hospitalisation)
class HospitalisationAdmin(admin.ModelAdmin):
    list_display = ['patient', 'lit', 'medecin_responsable', 'date_entree', 'date_sortie', 'statut']
    list_filter = ['statut', 'date_entree', 'lit__service']
    search_fields = ['patient__nom', 'patient__prenom', 'motif_admission']
    readonly_fields = ['date_creation', 'date_modification']
    inlines = [ObservationInline]


@admin.register(Observation)
class ObservationAdmin(admin.ModelAdmin):
    list_display = ['hospitalisation', 'auteur', 'date_observation']
    list_filter = ['date_observation']
    search_fields = ['contenu', 'hospitalisation__patient__nom']
    readonly_fields = ['date_observation']