
from django.contrib import admin
from django.urls import path, include
from projet.views import RegisterView, LoginView, UserView, LogoutView, EtudiantViewSet, CheckOrientationView,ChoixView,VerifierEmailView,EnvoyerEmailEtudiantsAPIView,OrientationViewSet,GridEvaluationViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'etudiants', EtudiantViewSet)
router.register(r'orientations', OrientationViewSet)
router.register(r'gridevaluation',GridEvaluationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include([
        path('register/', RegisterView.as_view()),
        path('login/', LoginView.as_view()),
        path('user/', UserView.as_view()),
        path('logout/', LogoutView.as_view()),
        path('', include(router.urls)),
        path('check-orientation/<int:user_id>/', CheckOrientationView.as_view()),
        path('choice/', ChoixView.as_view()),
        path('choice/<str:matricule>/', ChoixView.as_view(), name='choix-detail'),
        path('verify-email/', VerifierEmailView.as_view(), name='verify-email'),
        path('envoyeremail/', EnvoyerEmailEtudiantsAPIView.as_view()),
    ])),
]
