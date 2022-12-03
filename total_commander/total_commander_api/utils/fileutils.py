import os
import shutil


def safe_copy_file(file_path, out_dir) -> None:
    """Copy file from the old path to the new one
    and add a number to the end of the file name if
    the file already exists in the destination directory."""
    name: str = os.path.basename(file_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.copy(file_path, os.path.join(out_dir, name))
    else:
        item_index: int = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({item_index})")):
            item_index += 1
        shutil.copy(file_path, os.path.join(out_dir, name + f" ({item_index})"))


def safe_copy_folder(folder_path, out_dir) -> None:
    """Copy folder from the old path to the new one
    and add a number to the end of the folder name if
    the folder already exists in the destination directory."""
    name = os.path.basename(folder_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.copytree(folder_path, os.path.join(out_dir, name))
    else:
        item_index: int = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({item_index})")):
            item_index += 1
        shutil.copytree(folder_path, os.path.join(out_dir, name + f" ({item_index})"))


def safe_move_file(file_path, out_dir) -> None:
    """Move file from the old path to the new one
    and add a number to the end of the file name if
    the file already exists in the destination directory."""
    name: str = os.path.basename(file_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.move(file_path, os.path.join(out_dir, name))
    else:
        item_index: int = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({item_index})")):
            item_index += 1
        shutil.move(file_path, os.path.join(out_dir, name + f" ({item_index})"))


def safe_move_folder(folder_path, out_dir) -> None:
    """Move folder from the old path to the new one
    and add a number to the end of the folder name if
    the folder already exists in the destination directory."""
    name: str = os.path.basename(folder_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.move(folder_path, os.path.join(out_dir, name))
    else:
        item_index: int = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({item_index})")):
            item_index += 1
        shutil.move(folder_path, os.path.join(out_dir, name + f" ({item_index})"))


# unused function for performance reasons
def get_directory_size(dir_path) -> int:
    """Get the size of the directory in bytes."""
    total_size: int = 0
    for dirpath, dirnames, filenames in os.walk(dir_path):
        for filename in filenames:
            file_pointer: str = os.path.join(dirpath, filename)
            if not os.path.islink(file_pointer):
                total_size += os.path.getsize(file_pointer)

    return total_size
