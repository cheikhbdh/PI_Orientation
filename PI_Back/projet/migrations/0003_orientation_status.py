# Generated by Django 4.2.6 on 2024-04-26 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projet', '0002_etudiant_annee_etudiant_nom_etudiant_prenom_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orientation',
            name='status',
            field=models.CharField(choices=[('ouvert', 'ouvert'), ('pause', 'pause'), ('fermer', 'fermer')], default='fermer', max_length=20),
        ),
    ]