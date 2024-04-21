# Generated by Django 4.2.7 on 2024-04-21 03:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projet', '0003_etudiant'),
    ]

    operations = [
        migrations.CreateModel(
            name='Orientation',
            fields=[
                ('idO', models.AutoField(primary_key=True, serialize=False)),
                ('date_debut', models.DateField()),
                ('capacite_cnm', models.IntegerField()),
                ('capacite_rss', models.IntegerField()),
                ('capacite_dsi', models.IntegerField()),
                ('nombre_etudiants', models.IntegerField(default=0)),
                ('date_fin', models.DateField(blank=True, null=True)),
            ],
        ),
    ]
