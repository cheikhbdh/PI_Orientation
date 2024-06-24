from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, EtudiantSerializer, OrientationSerializer, Choix_Serializer, GridEvaluationSerializer
from .models import CustomUser, Etudiant, Orientation, Orientation_F, CHOIX_FILIERE, GridEvaluation
import jwt, datetime
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import BasePermission
from rest_framework.parsers import JSONParser
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from Orientation.settings import EMAIL_HOST_USER
import random
import pandas as pd
import os
import json
from django.conf import settings

class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationFailed('Token not provided', code='token_not_provided')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired', code='token_expired')

        user = CustomUser.objects.filter(id_u=payload['id']).first()
        if user is None:
            raise AuthenticationFailed('User not found!', code='user_not_found')
        return True

class IsAdmin(BasePermission):
    def has_permission(self, request):
        cookie = request.COOKIES.get('jwt')
        if not cookie:
            raise AuthenticationFailed('Unauthenticated!', code='unauthenticated')

        token = request.headers.get('Authorization')
        if not token:
            raise AuthenticationFailed('Token not provided', code='token_not_provided')
        if cookie != token:
            raise AuthenticationFailed('Cookie not found', code='cookie_not_found')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired', code='token_expired')

        user = CustomUser.objects.filter(id_u=payload['id']).first()
        if user is None:
            raise AuthenticationFailed('User not found!', code='user_not_found')

        if user.role == 'admin':
            return True
        else:
            raise AuthenticationFailed('User is not an admin', code='user_not_admin')

        return False

class VerifierEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        etudiant = Etudiant.objects.filter(email=email).first()
        if not etudiant:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

        verification_code = ''.join(random.choices('0123456789', k=6))
        send_mail(
            'Email Verification Code',
            f'Your email verification code is: {verification_code}',
            '22034@supnum.mr',
            ['22034@supnum.mr'],
            fail_silently=False,
        )
        return Response({"verification_code": verification_code}, status=status.HTTP_200_OK)

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not Etudiant.objects.filter(email=email).exists():
            return Response({"error": "Email not verified or not allowed for registration."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "cette email est deja exist"}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        login_or_email = request.data.get('login_or_email')
        password = request.data.get('password')

        if '@' in login_or_email:
            user = CustomUser.objects.filter(email=login_or_email).first()
        else:
            user = CustomUser.objects.filter(login=login_or_email).first()

        if user is None:
            raise AuthenticationFailed('User not found!', code='user_not_found')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!', code='incorrect_password')

        payload = {
            'id': user.id_u,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6),
            'iat': datetime.datetime.utcnow()
        }
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response({'jwt': token, 'id_u': user.id_u, 'role': user.role, 'login': user.login})
        response.set_cookie(key='jwt', value=token, httponly=True, secure=True, samesite='None')
        return response

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!', code='unauthenticated')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired', code='token_expired')

        user = CustomUser.objects.filter(id_u=payload['id']).first()
        if not user:
            raise AuthenticationFailed('User not found!', code='user_not_found')

        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        response = Response({'message': 'success'})
        response.delete_cookie('jwt')
        return response

class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer

class CHOIXFILIEREViewSet(viewsets.ModelViewSet):
    queryset = CHOIX_FILIERE.objects.all()
    serializer_class = Choix_Serializer

    def get_queryset(self):
        queryset = super().get_queryset()
        idc = self.request.query_params.get('idc', None)
        if idc is not None:
            queryset = queryset.filter(idc=idc)
        return queryset
class OrientationViewSet(viewsets.ModelViewSet):
    queryset = Orientation.objects.all()
    serializer_class = OrientationSerializer

    def perform_create(self, serializer):
        orientation = serializer.save()
        self.check_and_update_status(orientation)

    def check_and_update_status(self, orientation):
        today = timezone.now().date()
        if orientation.date_debut <= today <= orientation.date_fin:
            orientation.status = 'ouvert'
        elif today > orientation.date_fin:
            orientation.status = 'fermer'
        elif today < orientation.date_debut:
            orientation.status = 'fermer'
        orientation.save()

    @staticmethod
    def update_campagne_status():
        today = timezone.now().date()
        campagnes_to_open = Orientation.objects.filter(status='fermer', date_debut__lte=today, date_fin__gte=today)
        for campagne in campagnes_to_open:
            campagne.status = 'ouvert'
            campagne.save()
        campagnes_to_close = Orientation.objects.filter(status='ouvert', date_fin__lt=today)
        for campagne in campagnes_to_close:
            campagne.status = 'fermer'
            campagne.save()

class CheckOrientationView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id_u=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        etudiant = Etudiant.objects.filter(email=user.email).first()
        if not etudiant:
            return Response({"error": "No associated student found for this user"}, status=status.HTTP_404_NOT_FOUND)

        orientation_exists = Orientation_F.objects.filter(etudiant=etudiant).exists()
        choix_exists = CHOIX_FILIERE.objects.filter(idE=etudiant).exists()
        choix = CHOIX_FILIERE.objects.filter(idE=etudiant).first()
        c_orientation = Orientation.objects.filter( status="ouvert").exists()
        campagne_orientation = Orientation.objects.filter( status="ouvert").first()
        c_o = OrientationSerializer(campagne_orientation)
        choi_etudiant = Choix_Serializer(choix)
        if orientation_exists:
            return Response({"statu": "1"}, status=status.HTTP_200_OK)
        elif choix_exists:
            return Response({"statu": "2", "choix": choi_etudiant.data, "campagne": c_o.data}, status=status.HTTP_200_OK)
        elif c_orientation:
            return Response({"statu": "3", "campagne": c_o.data}, status=status.HTTP_200_OK)
        else:
            return Response({"statu": "4"}, status=status.HTTP_200_OK)
class CheckOrientationView1(APIView):
    def get(self, request, id):
        try:
            orientation = Orientation.objects.filter(idO=id).first()
            if not orientation:
                return Response({"error": "Aucune campagne d'orientation trouvée pour cet ID."}, status=status.HTTP_400_BAD_REQUEST)

            orientation_ouverte = Orientation.objects.filter(idO=id, status="ouvert").exists()
            id_existe_dans_orientation_f = Orientation_F.objects.filter(idO=orientation).exists()

            if orientation_ouverte or id_existe_dans_orientation_f:
                return Response({"orientation_ouverte": True}, status=status.HTTP_200_OK)
            else:
                return Response({"orientation_ouverte": False}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class ChoixView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = Choix_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, matricule):
        etudiant = Etudiant.objects.filter(matricule=matricule).first()
        choix_instance = self.get_object(etudiant.idE)
        serializer = Choix_Serializer(choix_instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self, pk):
        try:
            return CHOIX_FILIERE.objects.get(idE=pk)
        except CHOIX_FILIERE.DoesNotExist:
            return Response({"error": "choix n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

class EnvoyerEmailEtudiantsAPIView(APIView):
    def post(self, request):
        sujet = request.data.get('sujet')
        contenu = request.data.get('contenu')

        etudiants = Etudiant.objects.all()
        destinataires = [etudiant.email for etudiant in etudiants]

        send_mail(
            sujet,
            strip_tags(contenu),
            EMAIL_HOST_USER,
            destinataires,
            fail_silently=False,
            html_message=contenu,
        )

        return Response({'message': 'E-mails envoyés à tous les étudiants'}, status=status.HTTP_200_OK)

class GridEvaluationViewSet(viewsets.ModelViewSet):
    queryset = GridEvaluation.objects.all()
    serializer_class = GridEvaluationSerializer

class UploadPVView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        data = request.data
        try:
            # Définir le chemin où le fichier sera sauvegardé
            media_root = os.path.join(settings.BASE_DIR, 'media')
            if not os.path.exists(media_root):
                os.makedirs(media_root)

            # Obtenir l'année actuelle
            current_year = timezone.now().year
            file_name = f'PV_S1_{current_year}.json'
            file_path = os.path.join(media_root, file_name)

            # Enregistrer le fichier JSON
            with open(file_path, 'w', encoding='utf-8') as json_file:
                json.dump(data, json_file, ensure_ascii=False, indent=4)

            return Response({'message': 'Fichier JSON enregistré avec succès'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            # Log de l'erreur pour le débogage
            print(f"Erreur lors de l'enregistrement du fichier JSON: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CheckFileView(APIView):
    def get(self, request):
        year = request.query_params.get('year')
        file_name = f'PV_S1_{year}.json'
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)

        if os.path.exists(file_path):
            return Response({'file_exists': True}, status=status.HTTP_200_OK)
        else:
            return Response({'file_exists': False}, status=status.HTTP_200_OK)
        
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import json
import os
from .models import Etudiant, CHOIX_FILIERE, GridEvaluation
from .serializers import GridEvaluationSerializer
import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import CHOIX_FILIERE, Etudiant, GridEvaluation, Orientation, Orientation_F

import os
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import CHOIX_FILIERE, Etudiant, GridEvaluation, Orientation, Orientation_F

class ClasserEtudiantsView(APIView):
    def get(self, request, id):
        try:
            # Charger les données de pv.json
            pv_file_path = os.path.join(settings.MEDIA_ROOT, 'PV_S1_2024.json')
            with open(pv_file_path, 'r', encoding='utf-8') as file:
                pv_data = json.load(file)
            
            for etudiant in pv_data:
                if 'matricule' not in etudiant:
                    raise ValueError("Le fichier pv.json doit contenir des clés 'matricule' pour chaque étudiant.")

            # Récupérer les étudiants ayant fait des choix de filières pour cette orientation
            choix_etudiants = CHOIX_FILIERE.objects.filter(idc=id)
            etudiant_ids = choix_etudiants.values_list('idE', flat=True)
            etudiants = Etudiant.objects.filter(idE__in=etudiant_ids)

            # Construire un dictionnaire des moyennes et crédits par matricule
            etudiant_stats = {str(et['matricule']): et for et in pv_data}

            # Récupérer les critères d'évaluation
            evaluations = GridEvaluation.objects.all()
            if evaluations.exists():
                evaluation = evaluations.first()
                criteres = [
                    evaluation.critere1,
                    evaluation.critere2,
                    evaluation.critere3,
                    evaluation.critere4,
                    evaluation.critere5,
                    evaluation.critere6,
                    evaluation.critere7
                ]
            else:
                criteres = []

            # Classer les étudiants par les critères
            def sort_key(etudiant):
                matricule = str(etudiant.matricule)
                stats = etudiant_stats.get(matricule, {})
                return tuple(stats.get(critere, 0) for critere in criteres)

            etudiants_tries = sorted(etudiants, key=sort_key, reverse=True)

            # Récupérer la campagne d'orientation spécifiée par l'ID
            orientation = Orientation.objects.filter(idO=id).first()
            if not orientation:
                return Response({"error": "Aucune campagne d'orientation trouvée pour cet ID."}, status=status.HTTP_400_BAD_REQUEST)

            capacite = {
                'CNM': orientation.capacite_cnm,
                'RSS': orientation.capacite_rss,
                'DSI': orientation.capacite_dsi
            }

            # Orienter les étudiants selon leurs choix et les capacités
            resultats = []
            capacite_restante_evolution = []  # Liste pour stocker l'évolution des capacités restantes

            for etudiant in etudiants_tries:
                filiere_assignee = None
                choix = choix_etudiants.get(idE=etudiant.idE)
                if capacite[choix.choix1] > 0:
                    Orientation_F.objects.create(filiere=choix.choix1, etudiant=etudiant, idO=orientation)
                    capacite[choix.choix1] -= 1
                    filiere_assignee = choix.choix1
                elif capacite[choix.choix2] > 0:
                    Orientation_F.objects.create(filiere=choix.choix2, etudiant=etudiant, idO=orientation)
                    capacite[choix.choix2] -= 1
                    filiere_assignee = choix.choix2
                elif capacite[choix.choix3] > 0:
                    Orientation_F.objects.create(filiere=choix.choix3, etudiant=etudiant, idO=orientation)
                    capacite[choix.choix3] -= 1
                    filiere_assignee = choix.choix3
                if filiere_assignee:
                    resultats.append({
                        'matricule': etudiant.matricule,
                        'filiere': filiere_assignee
                    })

                # Ajouter les capacités restantes à la liste après chaque assignation
                capacite_restante_evolution.append({
                    "CNM": capacite['CNM'],
                    "RSS": capacite['RSS'],
                    "DSI": capacite['DSI']
                })

            etudiant_data = []
            classement = 1

            for etudiant in etudiants_tries:
                matricule = str(etudiant.matricule)
                stats = etudiant_stats.get(matricule, {})
                choix = choix_etudiants.get(idE=etudiant.idE)
                filier = Orientation_F.objects.filter(etudiant=etudiant.idE).first()
                filiere_assignee = next((res['filiere'] for res in resultats if res['matricule'] == matricule), 'N/A')
                data = {
                    "matricule": matricule,
                    "stats": {critere: stats.get(critere, 0) for critere in criteres},
                    "choix1": choix.choix1,
                    "choix2": choix.choix2,
                    "choix3": choix.choix3,
                    "orientation": filier.filiere,
                    "capacite_restante": capacite_restante_evolution[classement-1],  # Capacités restantes après orientation
                    "classement": classement
                }
                etudiant_data.append(data)
                classement += 1

            # Enregistrer les données dans un fichier JSON
            output_file_path = os.path.join(settings.MEDIA_ROOT,  f'PV_{id}.json')
            with open(output_file_path, 'w', encoding='utf-8') as output_file:
                json.dump(etudiant_data, output_file, ensure_ascii=False, indent=4)

            return Response(resultats, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Erreur lors du classement des étudiants: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetPVFileView(APIView):
    def get(self, request, id):
        try:
            # Construire le chemin du fichier JSON en fonction de l'ID de la campagne
            pv_file_path = os.path.join(settings.MEDIA_ROOT, f'PV_{id}.json')
            if not os.path.exists(pv_file_path):
                return Response({"error": "Fichier PV non trouvé"}, status=status.HTTP_404_NOT_FOUND)

            # Lire le fichier JSON
            with open(pv_file_path, 'r', encoding='utf-8') as file:
                pv_data = json.load(file)

            return Response(pv_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Erreur lors de la lecture du fichier PV: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class ImportEtudiantExcelView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Lire le fichier Excel
            df = pd.read_excel(file)

            # Vérifier que les colonnes nécessaires sont présentes
            required_columns = {'matricule', 'nom', 'prenom', 'semestre', 'annee', 'email'}
            if not required_columns.issubset(df.columns):
                return Response({'error': f'Missing required columns: {required_columns - set(df.columns)}'}, status=status.HTTP_400_BAD_REQUEST)

            # Enregistrer chaque étudiant dans la base de données
            for _, row in df.iterrows():
                etudiant_data = {
                    'matricule': row['matricule'],
                    'nom': row['nom'],
                    'prenom': row['prenom'],
                    'semestre': row['semestre'],
                    'annee': row['annee'],
                    'email': row['email']
                }
                serializer = EtudiantSerializer(data=etudiant_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': 'Étudiants importés avec succès'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class OrientationFinaleView(APIView):
    def get(self, request, id):
        try:
            orientation_f = Orientation_F.objects.filter(idO=id)
            resultats = [
                {
                    'matricule': entry.etudiant.matricule,
                    'filiere': entry.filiere
                }
                for entry in orientation_f
            ]
            return Response(resultats, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)