from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils import timezone
class CustomUser(AbstractUser):
    id_u = models.AutoField(primary_key=True)
    login = models.CharField(max_length=255, unique=True)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    username = None
    ROLE_CHOICES = [
        ('etudiant', 'etudiant'),
        ('admin', 'admin'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='etudiant')
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set", 
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",  # Changed related_name to avoid clash
        related_query_name="customuser",
    )

class Demande(models.Model):
    id = models.AutoField(primary_key=True)
    idU = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Clé étrangère vers CustomUser
    matricule = models.IntegerField()
    CHOIX_CHOICES = [
        ('dsi', 'DSI'),
        ('rss', 'RSS'),
        ('cnm', 'CNM'),
    ]
    choix1 = models.CharField(max_length=20, choices=CHOIX_CHOICES)
    choix2 = models.CharField(max_length=20, choices=CHOIX_CHOICES)
    choix3 = models.CharField(max_length=20, choices=CHOIX_CHOICES)

    def clean(self):
        if self.choix1 == self.choix2 or self.choix1 == self.choix3 or self.choix2 == self.choix3:
            raise ValidationError("Choices must be unique.")
class Etudiant(models.Model):
    idE = models.AutoField(primary_key=True)
    matricule = models.IntegerField(unique=True)
    email = models.CharField(max_length=255, unique=True)

class Orientation(models.Model):
    idO = models.AutoField(primary_key=True)
    date_debut = models.DateField()
    capacite_cnm = models.IntegerField()
    capacite_rss = models.IntegerField()
    capacite_dsi = models.IntegerField()
    nombre_etudiants = models.IntegerField(default=0)
    date_fin = models.DateField(null=True, blank=True)
    idu = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

def clean(self):
        if self.date_fin and self.date_debut > self.date_fin:
            raise ValidationError("La date de fin ne peut pas être antérieure à la date de début.")

        if self.capacite_cnm < 0 or self.capacite_rss < 0 or self.capacite_dsi < 0:
            raise ValidationError("Les capacités ne peuvent pas être négatives.")

        if self.date_debut < timezone.now().date():
            raise ValidationError("La date de début ne peut pas être dans le passé.")
class Orientation_F(models.Model):
    id_o = models.AutoField(primary_key=True)
    FILIERE_CHOICES = [
        ('DSI', 'DSI'),
        ('RSS', 'RSS'),
        ('CNM', 'CNM'),
    ]
    filiere = models.CharField(max_length=255,choices=FILIERE_CHOICES)
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name="orientations")

    def _str_(self):
        return f"{self.filiere} - {self.etudiant.email}"