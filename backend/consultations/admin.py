from django.contrib import admin

# Register your models here.

from .models import Consultation


@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['patient', 'date_consultation', 'motif', 'diagnostic']
    list_filter = ['date_consultation']
    search_fields = ['motif', 'diagnostic', 'patient__nom', 'patient__prenom']
    readonly_fields = ['date_creation', 'date_modification']

    fieldsets = (
        ('Informations', {
            'fields': ('patient', 'date_consultation', 'motif')
        }),
        ('Détails médicaux', {
            'fields': ('diagnostic', 'traitement', 'observations')
        }),
        ('Système', {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )