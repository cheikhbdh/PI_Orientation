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
        related_name="customuser_set",
        related_query_name="customuser",
    )


class Etudiant(models.Model):
    idE = models.AutoField(primary_key=True)
    matricule = models.IntegerField(unique=True)
    nom = models.CharField(max_length=255 )
    prenom = models.CharField(max_length=255 )
    semestre = models.CharField(max_length=255)
    annee = models.IntegerField()
    email = models.CharField(max_length=255, unique=True)

class Orientation(models.Model):
    idO = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=255, default='choix')
    date_debut = models.DateField()
    STATUS_CHOICES = [
        ('ouvert', 'ouvert'),
        ('pause', 'pause'),
        ('fermer', 'fermer'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='fermer')
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

        # if self.date_debut < timezone.now().date():
        #     raise ValidationError("La date de début ne peut pas être dans le passé.")
        
        # Vérifier qu'il n'y a pas d'autre orientation avec le statut 'ouvert'
        if self.status == 'ouvert':
            existing_open_orientations = Orientation.objects.filter(status='ouvert').exclude(idO=self.idO)
            if existing_open_orientations.exists():
                raise ValidationError("Il ne peut y avoir qu'une seule orientation avec le statut 'ouvert'.")

    def save(self, *args, **kwargs):
        self.clean()
        super(Orientation, self).save(*args, **kwargs)
class Orientation_F(models.Model):
    id_o = models.AutoField(primary_key=True)
    FILIERE_CHOICES = [
        ('DSI', 'DSI'),
        ('RSS', 'RSS'),
        ('CNM', 'CNM'),
    ]
    filiere = models.CharField(max_length=255,choices=FILIERE_CHOICES)
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name="orientations")
    idO = models.ForeignKey(Orientation, on_delete=models.CASCADE)

    def _str_(self):
        return f"{self.filiere} - {self.etudiant.email}"
class CHOIX_FILIERE(models.Model):
    id = models.AutoField(primary_key=True)
    idE = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    CHOIX_CHOICES = [
        ('DSI', 'DSI'),
        ('RSS', 'RSS'),
        ('CNM', 'CNM'),
    ]

    choix1 = models.CharField(max_length=20, choices=CHOIX_CHOICES)
    choix2 = models.CharField(max_length=20, choices=CHOIX_CHOICES)
    choix3 = models.CharField(max_length=20, choices=CHOIX_CHOICES)
    idc = models.ForeignKey(Orientation,on_delete=models.CASCADE)
    def clean(self):
        if self.choix1 == self.choix2 or self.choix1 == self.choix3 or self.choix2 == self.choix3:
            raise ValidationError("Choices must be unique.")
class GridEvaluation(models.Model):
    id = models.AutoField(primary_key=True)
    titre = models.CharField(max_length=255)
    critere1 = models.CharField(max_length=255)
    critere2 = models.CharField(max_length=255)
    critere3 = models.CharField(max_length=255)
    critere4 = models.CharField(max_length=255)
    critere5 = models.CharField(max_length=255)
    critere6 = models.CharField(max_length=255)
    critere7 = models.CharField(max_length=255)
    annee = models.IntegerField()

    def __str__(self):
        return f"{self.titre} - {self.annee}"
