from django.urls import path
from .views import (
    CreerCompteView,
    ListePersonnelView,
    ChangerMotDePasseView,
    MonProfilView,
    DesactiverCompteView
)

urlpatterns = [
    path('comptes/', CreerCompteView.as_view(), name='creer_compte'),
    path('comptes/personnel/', ListePersonnelView.as_view(), name='liste_personnel'),
    path('comptes/changer-mot-de-passe/', ChangerMotDePasseView.as_view(), name='changer_mdp'),
    path('comptes/mon-profil/', MonProfilView.as_view(), name='mon_profil'),
    path('comptes/desactiver/<int:user_id>/', DesactiverCompteView.as_view(), name='desactiver_compte'),
]