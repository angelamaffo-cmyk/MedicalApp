from django.db import models

# Create your models here.

from django.contrib.auth.models import User
from patients.models import Patient
from services.models import Lit


class Hospitalisation(models.Model):
    STATUT_CHOICES = [
        ('EN_COURS', 'En cours'),
        ('SORTI', 'Sorti'),
        ('TRANSFERE', 'Transféré'),
        ('DECEDE', 'Décédé'),
    ]

    patient = models.ForeignKey(
        Patient,
        on_delete=models.PROTECT,
        related_name='hospitalisations'
    )
    lit = models.ForeignKey(
        Lit,
        on_delete=models.PROTECT,
        related_name='hospitalisations'
    )
    medecin_responsable = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='hospitalisations'
    )
    date_entree = models.DateTimeField()
    date_sortie = models.DateTimeField(null=True, blank=True)
    motif_admission = models.TextField()
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='EN_COURS'
    )
    motif_sortie = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_entree']
        verbose_name = 'Hospitalisation'
        verbose_name_plural = 'Hospitalisations'

    def __str__(self):
        return f"{self.patient} — {self.lit} ({self.statut})"


class Observation(models.Model):
    hospitalisation = models.ForeignKey(
        Hospitalisation,
        on_delete=models.CASCADE,
        related_name='observations'
    )
    auteur = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='observations'
    )
    contenu = models.TextField()
    date_observation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_observation']
        verbose_name = 'Observation'
        verbose_name_plural = 'Observations'

    def __str__(self):
        return f"Observation du {self.date_observation} — {self.hospitalisation.patient}"