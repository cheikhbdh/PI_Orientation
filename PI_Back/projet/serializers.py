from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import CustomUser,CHOIX_FILIERE,Etudiant,Orientation , GridEvaluation

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['id_u', 'login', 'email', 'password', 'confirm_password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("The passwords do not match.")
        return data

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(str(exc))
        return value

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password field from validated_data
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
class Choix_Serializer(serializers.ModelSerializer):
    matricule = serializers.IntegerField(write_only=True)

    class Meta:
        model = CHOIX_FILIERE
        fields = ['matricule', 'choix1', 'choix2', 'choix3']

    def validate(self, attrs):
        # Check if Etudiant with this matricule exists
        try:
            etudiant = Etudiant.objects.get(matricule=attrs['matricule'])
        except Etudiant.DoesNotExist:
            raise serializers.ValidationError("No student found with this matricule")
        attrs.pop('matricule')
        attrs['idE'] = etudiant

        return attrs

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = ['idE', 'matricule', 'email']
class OrientationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orientation
        fields = ['idO','titre','date_debut','capacite_cnm', 'capacite_dsi','capacite_rss','nombre_etudiants','date_fin','idu']


class GridEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GridEvaluation
        fields = ['id', 'titre', 'critere1', 'critere2', 'critere3', 'critere4', 'critere5', 'critere6', 'critere7', 'annee']