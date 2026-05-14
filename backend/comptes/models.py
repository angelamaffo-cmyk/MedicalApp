from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class ProfilUtilisateur(models.Model):
    ROLE_CHOICES = [
        ('MEDECIN', 'Médecin'),
        ('INFIRMIER', 'Infirmier'),
    ]

    utilisateur = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profil'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    telephone = models.CharField(max_length=20, blank=True)
    specialite = models.CharField(max_length=100, blank=True)  # Pour les médecins
    est_actif = models.BooleanField(default=True)
    premiere_connexion = models.BooleanField(default=True)  # Pour forcer changement mdp
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Profil utilisateur'
        verbose_name_plural = 'Profils utilisateurs'

    def __str__(self):
        return f"{self.utilisateur.get_full_name()} — {self.role}"

    @property
    def est_medecin(self):
        return self.role == 'MEDECIN'

    @property
    def est_infirmier(self):
        return self.role == 'INFIRMIER'