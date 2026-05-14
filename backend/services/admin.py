from django.contrib import admin
from .models import Service, Lit

# Register your models here.




class LitInline(admin.TabularInline):
    model = Lit
    extra = 3


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['nom', 'get_nombre_lits', 'get_lits_disponibles', 'est_actif']
    list_filter = ['est_actif']
    search_fields = ['nom']
    inlines = [LitInline]

    def get_nombre_lits(self, obj):
        return obj.lits.filter(est_actif=True).count()
    get_nombre_lits.short_description = 'Total lits'

    def get_lits_disponibles(self, obj):
        return obj.lits.filter(statut='DISPONIBLE', est_actif=True).count()
    get_lits_disponibles.short_description = 'Lits disponibles'


@admin.register(Lit)
class LitAdmin(admin.ModelAdmin):
    list_display = ['numero', 'service', 'statut', 'est_actif']
    list_filter = ['statut', 'service', 'est_actif']
    search_fields = ['numero', 'service__nom']