from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer,EtudiantSerializer,OrientationSerializer
from .models import CustomUser,Etudiant,Orientation,Orientation_F
import jwt, datetime
from rest_framework import status
from rest_framework import viewsets

# class RegisterView(APIView):
#  def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#           serializer.save()
#           return Response(serializer.data, status=status.HTTP_201_CREATED)  # 201 Created
#         return Response({"error": "login  ou mots de pass n'est pas valide"}, status=status.HTTP_400_BAD_REQUEST)
class RegisterView(APIView):
 def post(self, request):
        # Vérifier d'abord si l'email est dans la table de vérification
        email = request.data.get('email')
        if not Etudiant.objects.filter(email=email).exists():
            return Response({"error": "Email not verified or not allowed for registration."}, status=status.HTTP_400_BAD_REQUEST)

        # Si l'email est vérifié, procéder à l'enregistrement de l'utilisateur
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
          serializer.save()
          return Response(serializer.data, status=status.HTTP_201_CREATED)  # 201 Created
        return Response({"error": "cette email est deja exist"}, status=status.HTTP_400_BAD_REQUEST)
 
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