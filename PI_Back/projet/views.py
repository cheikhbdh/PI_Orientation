from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, EtudiantSerializer, OrientationSerializer, Choix_Serializer
from .models import CustomUser, Etudiant, Orientation, Orientation_F, CHOIX_FILIERE
import jwt, datetime
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import BasePermission
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from Orientation.settings import EMAIL_HOST_USER
import random

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
            [email],
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

class OrientationViewSet(viewsets.ModelViewSet):
    queryset = Orientation.objects.all()
    serializer_class = OrientationSerializer

    def perform_create(self, serializer):
        orientation = serializer.save()
        self.check_and_update_status(orientation)

    def perform_update(self, serializer):
        instance = self.get_object()
        orientation = serializer.save()
        try:
            orientation.clean()
            orientation.save()
            self.check_and_update_status(orientation)
        except ValidationError as e:
            serializer._errors = e.message_dict
            raise ValidationError(e.message_dict)

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
    permission_classes = [IsAuthenticated]
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
        c_orientation = Orientation.objects.filter(semestre=etudiant.semestre, status="ouvert").exists()
        campagne_orientation = Orientation.objects.filter(semestre=etudiant.semestre).first()
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
