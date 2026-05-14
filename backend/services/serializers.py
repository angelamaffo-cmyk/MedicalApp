from rest_framework import serializers
from .models import Service, Lit


class LitSerializer(serializers.ModelSerializer):
    service_nom = serializers.CharField(source='service.nom', read_only=True)

    class Meta:
        model = Lit
        fields = ['id', 'service', 'service_nom', 'numero', 'statut', 'est_actif']

    def validate(self, data):
        service = data.get('service')
        numero = data.get('numero')
        if service and numero:
            qs = Lit.objects.filter(service=service, numero=numero)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError({
                    'numero': "Ce numéro de lit existe déjà dans ce service."
                })
        return data


class ServiceSerializer(serializers.ModelSerializer):
    lits = LitSerializer(many=True, read_only=True)
    nombre_lits = serializers.SerializerMethodField()
    lits_disponibles = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'nom', 'description', 'est_actif', 'nombre_lits', 'lits_disponibles', 'lits', 'date_creation']
        read_only_fields = ['date_creation']

    def get_nombre_lits(self, obj):
        return obj.lits.filter(est_actif=True).count()

    def get_lits_disponibles(self, obj):
        return obj.lits.filter(statut='DISPONIBLE', est_actif=True).count()