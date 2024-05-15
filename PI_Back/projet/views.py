from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer,EtudiantSerializer,OrientationSerializer
from .models import CustomUser,Etudiant,Orientation,Orientation_F
import jwt, datetime
from rest_framework import status
from rest_framework import viewsets
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from Orientation.settings import EMAIL_HOST_USER
class RegisterView(APIView):
 def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
          serializer.save()
          return Response(serializer.data, status=status.HTTP_201_CREATED)  # 201 Created
        return Response({"error": "login  ou mots de pass n'est pas valide"}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        login_or_email = request.data.get('login_or_email')
        password = request.data.get('password')

        if '@' in login_or_email:
            # Recherche par email
            user = CustomUser.objects.filter(email=login_or_email).first()
        else:
            # Recherche par login
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

        response = Response({'jwt': token,'id_u':user.id_u,'role':user.role,'login':user.login})

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
class CheckOrientationView(APIView):
    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id_u=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        etudiant = Etudiant.objects.filter(email=user.email).first()
        if not etudiant:
            return Response({"error": "No associated student found for this user"}, status=status.HTTP_404_NOT_FOUND)
        orientation_exists = Orientation_F.objects.filter(etudiant=etudiant).exists()
        if orientation_exists:
            return Response({"statu": "orienté"}, status=status.HTTP_200_OK)
        else:
            return Response({"statu": "non_orienté"}, status=status.HTTP_200_OK)
class EnvoyerEmailEtudiantsAPIView(APIView):
    def post(self, request):
        sujet = request.data.get('sujet')  # Obtenir le sujet de la requête POST
        contenu = request.data.get('contenu')  # Obtenir le contenu de la requête POST

        # Récupérer toutes les adresses e-mail des étudiants
        etudiants = Etudiant.objects.all()
        destinataires = [etudiant.email for etudiant in etudiants]

        # Envoyer l'e-mail à tous les étudiants
        send_mail(
            sujet,  # Sujet de l'e-mail
            strip_tags(contenu),  # Contenu de l'e-mail sans balises HTML
            EMAIL_HOST_USER,  # Adresse e-mail de l'expéditeur
            destinataires,  # Liste des adresses e-mail des destinataires
            fail_silently=False,  # Ne pas échouer silencieusement en cas d'erreur
            html_message=contenu,  # Contenu de l'e-mail avec balises HTML
        )

        return Response({'message': 'E-mails envoyés à tous les étudiants'}, status=status.HTTP_200_OK)