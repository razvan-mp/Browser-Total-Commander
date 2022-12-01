import os
import shutil


def safe_copy_file(file_path, out_dir):
    name = os.path.basename(file_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.copy(file_path, os.path.join(out_dir, name))
    else:
        i = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({i})")):
            i += 1
        shutil.copy(file_path, os.path.join(out_dir, name + f" ({i})"))


def safe_copy_folder(folder_path, out_dir):
    name = os.path.basename(folder_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.copytree(folder_path, os.path.join(out_dir, name))
    else:
        i = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({i})")):
            i += 1
        shutil.copytree(folder_path, os.path.join(out_dir, name + f" ({i})"))


def safe_move_file(file_path, out_dir):
    name = os.path.basename(file_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.move(file_path, os.path.join(out_dir, name))
    else:
        i = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({i})")):
            i += 1
        shutil.move(file_path, os.path.join(out_dir, name + f" ({i})"))


def safe_move_folder(folder_path, out_dir):
    name = os.path.basename(folder_path)
    if not os.path.exists(os.path.join(out_dir, name)):
        shutil.move(folder_path, os.path.join(out_dir, name))
    else:
        i = 1
        while os.path.exists(os.path.join(out_dir, name + f" ({i})")):
            i += 1
        shutil.move(folder_path, os.path.join(out_dir, name + f" ({i})"))
