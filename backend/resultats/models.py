from django.db import models

# Create your models here.

from examens.models import Examen


class Resultat(models.Model):
    # Lien vers l'examen correspondant
    examen = models.OneToOneField(
        Examen,
        on_delete=models.CASCADE,
        related_name='resultat'
    )

    # Résultat
    date_resultat = models.DateField()
    contenu = models.TextField()       # Le résultat détaillé
    conclusion = models.TextField()    # Conclusion du médecin
    est_normal = models.BooleanField(default=True)  # Normal ou anormal ?

    # Dates
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_resultat']
        verbose_name = 'Résultat d\'examen'
        verbose_name_plural = 'Résultats d\'examens'

    def __str__(self):
        return f"Résultat — {self.examen.nom_examen} ({self.examen.consultation.patient})"