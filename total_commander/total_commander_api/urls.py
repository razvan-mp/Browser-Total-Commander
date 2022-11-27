from django.urls import path
from . import views

urlpatterns = [
    path('hello', views.hello),
    path('rename_file', views.rename_file),
    path('delete_file', views.delete_file),
    path('create_file', views.create_file),
    path('create_folder', views.create_folder),
    path('delete_folder', views.delete_folder),
    path('copy_file', views.copy_file),
    path('get_files', views.get_files),
    path('move_one_up', views.move_one_up),
]