# Generated by Django 4.2.6 on 2024-04-21 21:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projet', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CHOIX_FILIERE',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('choix1', models.CharField(choices=[('dsi', 'DSI'), ('rss', 'RSS'), ('cnm', 'CNM')], max_length=20)),
                ('choix2', models.CharField(choices=[('dsi', 'DSI'), ('rss', 'RSS'), ('cnm', 'CNM')], max_length=20)),
                ('choix3', models.CharField(choices=[('dsi', 'DSI'), ('rss', 'RSS'), ('cnm', 'CNM')], max_length=20)),
                ('idE', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projet.etudiant')),
            ],
        ),
        migrations.DeleteModel(
            name='Demande',
        ),
    ]