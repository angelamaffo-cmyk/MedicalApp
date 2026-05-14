from django.db import models
from consultations.models import Consultation


class Examen(models.Model):
    TYPE_CHOICES = [
        ('BIOLOGIE', 'Biologie'),
        ('RADIOLOGIE', 'Radiologie'),
        ('ECHOGRAPHIE', 'Échographie'),
        ('SCANNER', 'Scanner'),
        ('IRM', 'IRM'),
        ('ECG', 'ECG'),
        ('AUTRE', 'Autre'),
    ]

    consultation = models.ForeignKey(
        Consultation,
        on_delete=models.PROTECT,
        related_name='examens'
    )
    type_examen = models.CharField(max_length=20, choices=TYPE_CHOICES)
    nom_examen = models.CharField(max_length=255)
    date_prescription = models.DateField()
    date_realisation = models.DateField(null=True, blank=True)
    laboratoire = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    est_actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_prescription']
        verbose_name = 'Examen médical'
        verbose_name_plural = 'Examens médicaux'

    def __str__(self):
        return f"{self.nom_examen} — {self.consultation.patient}"