from django.contrib import admin

# Register your models here.

from .models import Examen


@admin.register(Examen)
class ExamenAdmin(admin.ModelAdmin):
    list_display = ['nom_examen', 'type_examen', 'consultation', 'date_prescription', 'date_realisation', 'laboratoire']
    list_filter = ['type_examen', 'date_prescription']
    search_fields = ['nom_examen', 'laboratoire', 'consultation__patient__nom']
    readonly_fields = ['date_creation']