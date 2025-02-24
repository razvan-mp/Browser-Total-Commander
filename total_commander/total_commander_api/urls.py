from django.urls import path
from . import views

urlpatterns = [
    path("rename_file", views.rename_file),
    path("delete_file", views.delete_file),
    path("create_file", views.create_file),
    path("create_folder", views.create_folder),
    path("delete_folder", views.delete_folder),
    path("copy_file", views.copy_file),
    path("copy_folder", views.copy_folder),
    path("get_files", views.get_files),
    path("move_one_up", views.move_one_up),
    path("get_file_content", views.get_file_content),
    path("save_file_content", views.save_file_content),
    path("move_file", views.move_file),
    path("move_folder", views.move_folder),
    path("change_path_to", views.change_path_to),
]
