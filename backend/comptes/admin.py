from django.contrib import admin

# Register your models here.

from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import ProfilUtilisateur


class ProfilInline(admin.StackedInline):
    model = ProfilUtilisateur
    can_delete = False


@admin.register(ProfilUtilisateur)
class ProfilUtilisateurAdmin(admin.ModelAdmin):
    list_display = ['get_nom', 'get_email', 'role', 'est_actif', 'premiere_connexion', 'date_creation']
    list_filter = ['role', 'est_actif', 'premiere_connexion']
    search_fields = ['utilisateur__first_name', 'utilisateur__last_name', 'utilisateur__email']
    readonly_fields = ['date_creation']

    def get_nom(self, obj):
        return obj.utilisateur.get_full_name()
    get_nom.short_description = 'Nom complet'

    def get_email(self, obj):
        return obj.utilisateur.email
    get_email.short_description = 'Email'