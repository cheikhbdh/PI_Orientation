
from django.contrib import admin
from django.urls import path, include
from projet.views import RegisterView, LoginView, UserView, LogoutView, EtudiantViewSet, OrientationViewSet,CheckOrientationView,ChoixView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'etudiants', EtudiantViewSet)
router.register(r'orientations', OrientationViewSet)

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
    ])),
]
