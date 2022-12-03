import json
import os
from datetime import datetime
import total_commander_api.utils.fileutils as fileutils
import shutil

from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view

from total_commander_api.utils.Item import Item


@api_view(["POST"])
def get_files(request) -> JsonResponse:
    """Return a list of files and folders lcoated at the given path."""
    data: dict = json.loads(request.body)
    path: str = data["path"]
    items: list[str] = os.listdir(path)
    response: list = []
    for item in items:
        item = os.path.join(path, item)
        if os.path.isdir(item):
            item = Item(
                "folder",
                os.path.abspath(item),
                "",
                datetime.fromtimestamp(os.path.getatime(item)),
            )
        else:
            item = Item(
                "file",
                os.path.abspath(item),
                f"{round(os.path.getsize(os.path.abspath(item)) / 1024, 2)}\
                     KB",
                datetime.fromtimestamp(os.path.getatime(item)),
            )
        response.append(item.__dict__)
    return JsonResponse(response, safe=False)


@api_view(["POST"])
def rename_file(request) -> JsonResponse:
    """Rename file/folder located at the given path."""
    data: dict = json.loads(request.body)
    old_name: str = data["old_name"]
    new_name: str = data["new_name"]
    try:
        os.rename(old_name, new_name)
    except FileExistsError:
        return JsonResponse({"error": "File already exists"})
    return JsonResponse({"message": "File renamed"})


@api_view(["POST"])
def delete_file(request) -> JsonResponse:
    """Delete file/folder located at the given path."""
    data: dict = json.loads(request.body)
    file_name: str = data["file_name"]
    os.remove(file_name)
    return JsonResponse({"message": "File deleted"})


@api_view(["POST"])
def create_file(request) -> JsonResponse:
    """Create file at the given path."""
    data: dict = json.loads(request.body)
    file_name: str = data["file_name"]
    open(file_name, "a").close()
    return JsonResponse({"message": "File created"})


@api_view(["POST"])
def create_folder(request) -> JsonResponse:
    """Create folder at the given path."""
    data: dict = json.loads(request.body)
    folder_name: str = data["folder_name"]
    os.mkdir(folder_name)
    return JsonResponse({"message": "Folder created"})


@api_view(["POST"])
def delete_folder(request) -> JsonResponse:
    """Delete folder at the given path."""
    data: dict = json.loads(request.body)
    folder_name: str = data["folder_name"]
    shutil.rmtree(folder_name)
    return JsonResponse({"message": "Folder deleted"})


@api_view(["POST"])
def copy_file(request) -> JsonResponse:
    """Copy file from the old path to the new one."""
    data: dict = json.loads(request.body)
    old_name: str = data["old_name"]
    new_name: str = data["new_name"]
    fileutils.safe_copy_file(old_name, new_name)
    return JsonResponse({"message": "File copied"})


@api_view(["POST"])
def copy_folder(request) -> JsonResponse:
    """Copy folder from the old path to the new one."""
    data: dict = json.loads(request.body)
    old_name: str = data["old_name"]
    new_name: str = data["new_name"]
    fileutils.safe_copy_folder(old_name, new_name)
    return JsonResponse({"message": "Folder copied"})


@api_view(["POST"])
def move_file(request) -> JsonResponse:
    """Move file from the old path to the new one."""
    data: dict = json.loads(request.body)
    old_name: str = data["old_name"]
    new_name: str = data["new_name"]
    fileutils.safe_move_file(old_name, new_name)
    return JsonResponse({"message": "File moved"})


@api_view(["POST"])
def move_folder(request) -> JsonResponse:
    """Move folder from the old path to the new one."""
    data: dict = json.loads(request.body)
    old_name: str = data["old_name"]
    new_name: str = data["new_name"]
    fileutils.safe_move_folder(old_name, new_name)
    return JsonResponse({"message": "Folder moved"})


@api_view(["POST"])
def move_one_up(request) -> JsonResponse:
    """Move one folder up."""
    data: dict = json.loads(request.body)
    path: str = data["current_path"]
    path = os.path.dirname(os.path.abspath(path))
    return JsonResponse({"new_path": path})


@api_view(["POST"])
def change_path_to(request) -> JsonResponse:
    """Change path to the given one."""
    data: dict = json.loads(request.body)
    path: str = data["path"]
    if not os.path.exists(path):
        return JsonResponse({"message": "Path does not exist"})
    if not os.path.isdir(path):
        return JsonResponse({"message": "Path is not a directory"})
    if not os.path.isabs(path):
        return JsonResponse({"message": "Path is not absolute"})
    return JsonResponse({"message": path})


@api_view(["POST"])
def get_file_content(request) -> JsonResponse:
    """Return file content."""
    data: dict = json.loads(request.body)
    file_name: str = data["file_name"]
    content: str = open(file_name, "r").read()
    return JsonResponse({"content": content})


@api_view(["POST"])
def save_file_content(request) -> JsonResponse:
    """Save file content."""
    data: dict = json.loads(request.body)
    file_name: str = data["file_name"]
    content: str = data["content"]
    open(file_name, "w").write(content)
    return JsonResponse({"message": "File saved"})
