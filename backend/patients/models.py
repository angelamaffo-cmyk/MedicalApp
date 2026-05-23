from django.db import models
from django.contrib.auth.models import User


class Patient(models.Model):
    SEXE_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]

    GROUPE_SANGUIN_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
    ]
# Médecin généraliste qui a créé le patient
    medecin_generaliste = models.ForeignKey(
        User, on_delete=models.PROTECT,
        related_name='patients_crees', null=True
    )
    medecin_actuel = models.ForeignKey( User, on_delete=models.SET_NULL, null=True, blank=True, related_name='patients_en_charge')
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    sexe = models.CharField(max_length=1, choices=SEXE_CHOICES)
    date_naissance = models.DateField()
    telephone = models.CharField(max_length=20)
    adresse = models.TextField(blank=True)
    groupe_sanguin = models.CharField(max_length=3, choices=GROUPE_SANGUIN_CHOICES)
    contact_urgence_nom = models.CharField(max_length=200, blank=True)
    contact_urgence_telephone = models.CharField(max_length=20, blank=True)
    est_actif = models.BooleanField(default=True)
    date_enregistrement = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nom', 'prenom']
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'

    def __str__(self):
        return f"{self.nom} {self.prenom}"
    
class AssignationMedecin(models.Model):
    """Médecin assigne un patient à un autre médecin spécialiste"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='assignations_medecin')
    medecin_source = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignations_faites')
    medecin_cible = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignations_recues')
    motif = models.TextField()
    service = models.CharField(max_length=100, blank=True)
    date_assignation = models.DateTimeField(auto_now_add=True)
    est_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-date_assignation']
        verbose_name = 'Assignation médecin'

    def __str__(self):
        return f"{self.patient} → {self.medecin_cible.get_full_name()}"
class AssignationInfirmier(models.Model):
    """Médecin assigne un patient à un infirmier pour des soins"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='assignations_infirmier')
    medecin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignations_infirmier_faites')
    infirmier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patients_soins')
    soins_a_faire = models.TextField()
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True)
    est_active = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_creation']
        verbose_name = 'Assignation infirmier'

    def __str__(self):
        return f"{self.patient} → {self.infirmier.get_full_name()}"
class Soin(models.Model):
    """Soins effectués par un infirmier"""
    assignation = models.ForeignKey(AssignationInfirmier, on_delete=models.CASCADE, related_name='soins')
    infirmier = models.ForeignKey(User, on_delete=models.CASCADE, related_name='soins_effectues')
    description = models.TextField()
    observations = models.TextField(blank=True)
    date_soin = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_soin']
        verbose_name = 'Soin'

    def __str__(self):
        return f"Soin — {self.assignation.patient} par {self.infirmier.get_full_name()}"