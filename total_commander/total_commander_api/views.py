import json
from django.http import HttpResponse, JsonResponse
import os
from rest_framework.decorators import api_view

@api_view(["GET"])
def hello(request):
    return HttpResponse("Hello World!")

@api_view(["POST"])
def rename_file(request):
    data = json.loads(request.body)
    old_name = data["old_name"]
    new_name = data["new_name"]
    os.rename(old_name, new_name)
    return JsonResponse({"message": "File renamed"})

@api_view(["POST"])
def delete_file(request):
    data = json.loads(request.body)
    file_name = data["file_name"]
    os.remove(file_name)
    return JsonResponse({"message": "File deleted"})

@api_view(["POST"])
def create_file(request):
    data = json.loads(request.body)
    file_name = data["file_name"]
    open(file_name, "a").close()
    return JsonResponse({"message": "File created"})

@api_view(["POST"])
def create_folder(request):
    data = json.loads(request.body)
    folder_name = data["folder_name"]
    os.mkdir(folder_name)
    return JsonResponse({"message": "Folder created"})

@api_view(["POST"])
def delete_folder(request):
    data = json.loads(request.body)
    folder_name = data["folder_name"]
    os.rmdir(folder_name)
    return JsonResponse({"message": "Folder deleted"})

@api_view(["POST"])
def copy_file(request):
    data = json.loads(request.body)
    old_name = data["old_name"]
    new_name = data["new_name"]
    open(new_name, "w").write(open(old_name, "r").read())
    return JsonResponse({"message": "File copied"})
