from django.db import models
from patients.models import Patient


class Consultation(models.Model):
    patient = models.ForeignKey(
        Patient,
        on_delete=models.PROTECT,
        related_name='consultations'
    )
    date_consultation = models.DateField()
    motif = models.CharField(max_length=255)
    diagnostic = models.TextField()
    traitement = models.TextField(blank=True)
    observations = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_consultation']
        verbose_name = 'Consultation'
        verbose_name_plural = 'Consultations'

    def __str__(self):
        return f"Consultation du {self.date_consultation} — {self.patient}"