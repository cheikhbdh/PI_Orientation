
from django.contrib import admin
from django.urls import path, include
from projet.views import RegisterView, LoginView, UserView,GetPVFileView, LogoutView,ClasserEtudiantsView, EtudiantViewSet, CheckOrientationView,ChoixView,VerifierEmailView,EnvoyerEmailEtudiantsAPIView,CheckOrientationView1,OrientationViewSet,GridEvaluationViewSet ,UploadPVView ,CheckFileView,CHOIXFILIEREViewSet,OrientationFinaleView,ImportEtudiantExcelView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'etudiants', EtudiantViewSet)
router.register(r'orientations', OrientationViewSet)
router.register(r'gridevaluation',GridEvaluationViewSet)
router.register(r'choixfiliere',CHOIXFILIEREViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include([
        path('register/', RegisterView.as_view()),
        path('login/', LoginView.as_view()),
        path('user/', UserView.as_view()),
        path('logout/', LogoutView.as_view()),
        path('', include(router.urls)),
        path('check-orientation/<int:user_id>/', CheckOrientationView.as_view()),
        path('check-orientation1/<int:id>/', CheckOrientationView1.as_view()),
        path('classer-etudiants/<int:id>/', ClasserEtudiantsView.as_view(), name='classer-etudiants'),
        path('orientation-finale/<int:id>/', OrientationFinaleView.as_view(), name='orientation-finale'),
        path('choice/', ChoixView.as_view()),
        path('choice/<str:matricule>/', ChoixView.as_view(), name='choix-detail'),
        path('verify-email/', VerifierEmailView.as_view(), name='verify-email'),
        path('envoyeremail/', EnvoyerEmailEtudiantsAPIView.as_view()),
        path('get-pv/<int:id>/', GetPVFileView.as_view(), name='get-pv'),
        path('upload-pv/', UploadPVView.as_view(), name='upload_pv'),
        path('check-pv-file/', CheckFileView.as_view(), name='check-file'),
        path('import-etudiants/', ImportEtudiantExcelView.as_view(), name='import-etudiants'),
    ])),
]
