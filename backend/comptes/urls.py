from django.urls import path
from .views import (
    CreerCompteView,
    ListePersonnelView,
    ChangerMotDePasseView,
    ListePersonnelMedicalView,
    MonProfilView,
    DesactiverCompteView
)

urlpatterns = [
    path('comptes/creer/', CreerCompteView.as_view(), name='creer_compte'),
    path('comptes/personnel/', ListePersonnelView.as_view(), name='liste_personnel'),
    path('comptes/personnel-medical/', ListePersonnelMedicalView.as_view(), name='liste_personnel_medical'),

    path('comptes/changer-mot-de-passe/', ChangerMotDePasseView.as_view(), name='changer_mdp'),
    path('comptes/mon-profil/', MonProfilView.as_view(), name='mon_profil'),
    path('comptes/desactiver/<int:user_id>/', DesactiverCompteView.as_view(), name='desactiver_compte'),
]