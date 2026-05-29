from django.db import models
from examens.models import Examen


class Resultat(models.Model):
    examen = models.OneToOneField(
        Examen,
        on_delete=models.PROTECT,
        related_name='resultat'
    )
    date_resultat = models.DateField()
    contenu = models.TextField()
    conclusion = models.TextField()
    est_normal = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_resultat']
        verbose_name = "Résultat d'examen"
        verbose_name_plural = "Résultats d'examens"

    def __str__(self):
        return f"Résultat — {self.examen.nom_examen} ({self.examen.consultation.patient})"