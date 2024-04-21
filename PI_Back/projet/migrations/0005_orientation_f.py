# Generated by Django 4.2.7 on 2024-04-21 14:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projet', '0004_orientation'),
    ]

    operations = [
        migrations.CreateModel(
            name='Orientation_F',
            fields=[
                ('id_o', models.AutoField(primary_key=True, serialize=False)),
                ('filiere', models.CharField(choices=[('DSI', 'DSI'), ('RSS', 'RSS'), ('CNM', 'CNM')], max_length=255)),
                ('etudiant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orientations', to='projet.etudiant')),
            ],
        ),
    ]
