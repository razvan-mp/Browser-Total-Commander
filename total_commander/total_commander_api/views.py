import json
import os
from datetime import datetime
import total_commander_api.utils.fileutils as fileutils
import shutil

from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

from total_commander_api.utils.Item import Item


@api_view(["GET"])
def hello(request):
    return HttpResponse("Hello World!")


@api_view(["POST"])
def get_files(request):
    data = json.loads(request.body)
    path = data['path']
    items = os.listdir(path)
    response = []
    for item in items:
        item = os.path.join(path, item)
        if os.path.isdir(item):
            item = Item('folder', os.path.abspath(item), 0, datetime.fromtimestamp(os.path.getatime(item)))
        else:
            item = Item('file', os.path.abspath(item), os.path.getsize(item),
                        datetime.fromtimestamp(os.path.getatime(item)))
        response.append(item.__dict__)
    return JsonResponse(response, safe=False)


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
    shutil.rmtree(folder_name)
    return JsonResponse({"message": "Folder deleted"})


@api_view(["POST"])
def copy_file(request):
    data = json.loads(request.body)
    old_name = data["old_name"]
    new_name = data["new_name"]
    fileutils.safe_copy_file(old_name, new_name)
    return JsonResponse({"message": "File copied"})


@api_view(["POST"])
def copy_folder(request):
    data = json.loads(request.body)
    old_name = data["old_name"]
    new_name = data["new_name"]
    fileutils.safe_copy_folder(old_name, new_name)
    return JsonResponse({"message": "Folder copied"})


@api_view(["POST"])
def move_one_up(request):
    data = json.loads(request.body)
    path: str = data['current_path']
    path = os.path.dirname(os.path.abspath(path))
    return JsonResponse({"new_path": path})

@api_view(["POST"])
def get_file_content(request):
    data = json.loads(request.body)
    file_name = data["file_name"]
    content = open(file_name, "r").read()
    return JsonResponse({"content": content})

@api_view(["POST"])
def save_file_content(request):
    data = json.loads(request.body)
    file_name = data["file_name"]
    content = data["content"]
    open(file_name, "w").write(content)
    return JsonResponse({"message": "File saved"})


@api_view(["POST"])
def move_file(request):
    data = json.loads(request.body)
    old_name = data["old_name"]
    new_name = data["new_name"]
    fileutils.safe_move_file(old_name, new_name)
    return JsonResponse({"message": "File moved"})


@api_view(["POST"])
def move_folder(request):
    data = json.loads(request.body)
    old_name = data["old_name"]
    new_name = data["new_name"]
    fileutils.safe_move_folder(old_name, new_name)
    return JsonResponse({"message": "Folder moved"})
