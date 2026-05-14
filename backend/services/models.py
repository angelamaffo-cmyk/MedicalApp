from django.db import models

# Create your models here.
class Service(models.Model):
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    est_actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nom']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'

    def __str__(self):
        return self.nom
    
class Lit(models.Model):
    STATUT_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('OCCUPE', 'Occupé'),
        ('MAINTENANCE', 'En maintenance'),
    ]

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='lits'
    )
    numero = models.CharField(max_length=20)
    statut = models.CharField(
         max_length=20,
        choices=STATUT_CHOICES,
        default='DISPONIBLE'
    )
    est_actif = models.BooleanField(default=True)

    class Meta:
        ordering = ['service', 'numero']
        verbose_name = 'Lit'
        verbose_name_plural = 'Lits'
        unique_together = ['service', 'numero']
    def __str__(self):
        return f"Lit {self.numero} — {self.service.nom} ({self.statut})"