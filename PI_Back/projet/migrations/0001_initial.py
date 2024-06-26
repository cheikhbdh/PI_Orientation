# Generated by Django 4.2.7 on 2024-05-27 18:27

import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id_u', models.AutoField(primary_key=True, serialize=False)),
                ('login', models.CharField(max_length=255, unique=True)),
                ('email', models.CharField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('role', models.CharField(choices=[('etudiant', 'etudiant'), ('admin', 'admin')], default='etudiant', max_length=20)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='customuser_set', related_query_name='customuser', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='customuser_set', related_query_name='customuser', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Etudiant',
            fields=[
                ('idE', models.AutoField(primary_key=True, serialize=False)),
                ('matricule', models.IntegerField(unique=True)),
                ('nom', models.CharField(max_length=255)),
                ('prenom', models.CharField(max_length=255)),
                ('semestre', models.CharField(max_length=255)),
                ('annee', models.IntegerField()),
                ('email', models.CharField(max_length=255, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Orientation_F',
            fields=[
                ('id_o', models.AutoField(primary_key=True, serialize=False)),
                ('filiere', models.CharField(choices=[('DSI', 'DSI'), ('RSS', 'RSS'), ('CNM', 'CNM')], max_length=255)),
                ('etudiant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orientations', to='projet.etudiant')),
            ],
        ),
        migrations.CreateModel(
            name='Orientation',
            fields=[
                ('idO', models.AutoField(primary_key=True, serialize=False)),
                ('titre', models.CharField(default='choix', max_length=255)),
                ('date_debut', models.DateField()),
                ('status', models.CharField(choices=[('ouvert', 'ouvert'), ('pause', 'pause'), ('fermer', 'fermer')], default='fermer', max_length=20)),
                ('capacite_cnm', models.IntegerField()),
                ('capacite_rss', models.IntegerField()),
                ('capacite_dsi', models.IntegerField()),
                ('nombre_etudiants', models.IntegerField(default=0)),
                ('date_fin', models.DateField(blank=True, null=True)),
                ('idu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projet.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='CHOIX_FILIERE',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('choix1', models.CharField(choices=[('DSI', 'DSI'), ('RSS', 'RSS'), ('CNM', 'CNM')], max_length=20)),
                ('choix2', models.CharField(choices=[('DSI', 'DSI'), ('RSS', 'RSS'), ('CNM', 'CNM')], max_length=20)),
                ('choix3', models.CharField(choices=[('DSI', 'DSI'), ('RSS', 'RSS'), ('CNM', 'CNM')], max_length=20)),
                ('idE', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projet.etudiant')),
            ],
        ),
    ]
