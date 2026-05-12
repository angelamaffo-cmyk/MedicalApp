from django.contrib import admin

# Register your models here.

from .models import Resultat


@admin.register(Resultat)
class ResultatAdmin(admin.ModelAdmin):
    list_display = ['examen', 'date_resultat', 'est_normal', 'conclusion']
    list_filter = ['est_normal', 'date_resultat']
    search_fields = ['examen__nom_examen', 'conclusion', 'contenu']
    readonly_fields = ['date_creation', 'date_modification']