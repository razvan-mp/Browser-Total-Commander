import { Component } from '@angular/core';
import axios from 'axios';
import { ItemModel } from '../../assets/models/ItemModel';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent {
  title = 'main-page';

  left_side_file_list: Array<ItemModel> = [];
  right_side_file_list: Array<ItemModel> = [];
  left_current_path: string = '';
  right_current_path: string = '';

  constructor() {}

  ngOnInit() {
    this.left_current_path = '.';
    this.right_current_path = '.';
    this.resetItems('left');
    this.resetItems('right');
  }

  addItemToQueue(item_id: string) {
    const element = document.getElementById(item_id)!;
    if (element.classList.contains('selected'))
      element.classList.remove('selected');
    else element.classList.add('selected');
  }

  resetItems(side: string) {
    if (side == 'left') {
      this.left_side_file_list = [];
      axios
        .post(
          'http://localhost:8000/api/get_files',
          JSON.stringify({ path: this.left_current_path })
        )
        .then((response: any) => {
          for (const responseElement of response.data) {
            let item = new ItemModel(
              responseElement['path'],
              responseElement['last_accessed'],
              responseElement['size'],
              responseElement['type']
            );
            this.left_side_file_list.push(item);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else {
      this.right_side_file_list = [];
      axios
        .post(
          'http://localhost:8000/api/get_files',
          JSON.stringify({ path: this.right_current_path })
        )
        .then((response: any) => {
          for (const responseElement of response.data) {
            let item = new ItemModel(
              responseElement['path'],
              responseElement['last_accessed'],
              responseElement['size'],
              responseElement['type']
            );
            this.right_side_file_list.push(item);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }

  openModal(modal_id: string, item_path: string) {
    if (modal_id === 'edit-file-modal') {
      axios
        .post(
          'http://localhost:8000/api/get_file_content',
          JSON.stringify({ file_name: item_path })
        )
        .then((response: any) => {
          const textArea = document.getElementById('edit-file-textarea')!;
          // @ts-ignore
          textArea.value = response.data['content'];
          textArea.setAttribute('data-location', item_path);
        })
        .catch((error: any) => {
          console.error(error);
          this.showFailure('Failed to open file. Check console output.');
        });
    }

    const elementStyle =
      '  background: white;\n' +
      '  outline: none;\n' +
      '  border: none;\n' +
      '  padding: 10px;\n' +
      "  font-family: 'Inter', sans-serif;\n" +
      '  box-shadow: 0 3px 10px 1px rgba(0, 0, 0, 0.2);\n' +
      '  font-size: 1rem;\n' +
      '  border-radius: 10px;';

    let elements = Array.from(document.getElementsByClassName('selected')!);
    if (modal_id === 'rename-file-left-modal') {
      const inputDiv = document.getElementById('rename-file-left-inputs')!;
      let item_count = 0;

      for (let i = 0; i < elements.length; i++) {
        if (
          elements[i].attributes['id' as any].value
            .toString()
            .startsWith('left')
        ) {
          const name = elements[i].attributes['location' as any].value
            .toString()
            .split('\\')
            .pop()!;

          if (
            elements[i].attributes['item-type' as any].value.toString() ===
            'folder'
          ) {
            inputDiv.innerHTML += '<label class="label">Folder name</label>';
          } else {
            inputDiv.innerHTML +=
              '<label class="label">File name & extension</label>';
          }

          inputDiv.innerHTML +=
            "<div style='display: flex; flex-direction: row; gap: 5px; align-items: baseline;'>" +
            '<input data-attr="' +
            elements[i].attributes['location' as any].value.toString() +
            '" name="item_' +
            item_count +
            '" style="' +
            elementStyle +
            '" value="' +
            name +
            '">';
          item_count++;
        }
      }
    } else if (modal_id === 'rename-file-right-modal') {
      const inputDiv = document.getElementById('rename-file-right-inputs')!;
      let item_count = 0;

      for (let i = 0; i < elements.length; i++) {
        if (
          elements[i].attributes['id' as any].value
            .toString()
            .startsWith('right')
        ) {
          const name = elements[i].attributes['location' as any].value
            .toString()
            .split('\\')
            .pop()!;

          if (
            elements[i].attributes['item-type' as any].value.toString() ===
            'folder'
          ) {
            inputDiv.innerHTML += '<label class="label">Folder name</label>';
          } else {
            inputDiv.innerHTML +=
              '<label class="label">File name & extension</label>';
          }

          inputDiv.innerHTML +=
            "<div style='display: flex; flex-direction: row; gap: 5px; align-items: baseline;'>" +
            '<input data-attr="' +
            elements[i].attributes['location' as any].value.toString() +
            '" name="item_' +
            item_count +
            '" style="' +
            elementStyle +
            '" value="' +
            name +
            '">';
          item_count++;
        }
      }
    }

    document.getElementById(modal_id)!.classList.add('is-active');
  }

  hideModal(modal_id: string) {
    if (modal_id === 'rename-file-left-modal') {
      document.getElementById('rename-file-left-inputs')!.innerHTML = '';
    } else if (modal_id === 'rename-file-right-modal') {
      document.getElementById('rename-file-right-inputs')!.innerHTML = '';
    } else if (modal_id === 'edit-file-modal') {
      const textArea = document.getElementById('edit-file-textarea')!;
      // @ts-ignore
      textArea.value = '';
      textArea.setAttribute('data-location', '');
    }
    document.getElementById(modal_id)!.classList.remove('is-active');
  }

  createNewFile(side: string, newFileForm: HTMLFormElement) {
    let formData = new FormData(newFileForm);
    let fileObject = Object.fromEntries(formData as any) as any;
    let path = '';
    if (side === 'left') {
      path += this.left_current_path;
    } else {
      path += this.right_current_path;
    }

    path += '\\' + fileObject['file_name'];

    if (fileObject['file_extension'] !== '') {
      path += '.' + fileObject['file_extension'];
    }

    axios
      .post(
        'http://localhost:8000/api/create_file',
        JSON.stringify({ file_name: path })
      )
      .then((response: any) => {
        if (response.status == 200) {
          this.showSuccess('File created successfully!');
        }
        this.resetItems(side);
      })
      .catch((error: any) => {
        this.showFailure('Error creating file. Check server logs.');
      });

    newFileForm.reset();
  }

  createNewFolder(side: string, newFolderForm: HTMLFormElement) {
    let formData = new FormData(newFolderForm);
    let folderObject = Object.fromEntries(formData as any) as any;
    let path = '';
    if (side === 'left') {
      path += this.left_current_path;
    } else {
      path += this.right_current_path;
    }

    path += '\\' + folderObject['folder_name'];

    axios
      .post(
        'http://localhost:8000/api/create_folder',
        JSON.stringify({ folder_name: path })
      )
      .then((response: any) => {
        if (response.status == 200) {
          this.showSuccess('Folder created successfully!');
        }
        this.resetItems(side);
      })
      .catch((error: any) => {
        this.showFailure('Error creating folder. Check server logs.');
      });

    newFolderForm.reset();
  }

  doActionOnItem(item_type: string, item_path: string, side: string) {
    if (item_type === 'folder') {
      if (side === 'left') {
        this.left_current_path = item_path;
        this.resetItems(side);
      } else {
        this.right_current_path = item_path;
        this.resetItems(side);
      }
    } else {
      this.openModal('edit-file-modal', item_path);
    }
  }

  renameSelected(side: string, renameFileForm: HTMLFormElement) {
    let path: string = '';
    if (side === 'left') {
      path = this.left_current_path + "\\";
    } else {
      path = this.right_current_path + "\\";
    }

    const content: Object = Object.fromEntries(
      new FormData(renameFileForm) as any
    ) as any;

    if (path === '.' && Object.keys(content).length > 0) {
      let tmp = document
        .getElementsByName('item_0')[0]
        .getAttribute('data-attr')!;
      path = tmp.split('\\').slice(0, -1).join('\\') + '\\';
    }

    let failure = 0;
    let success = 0;
    for (let i = 0; i < Object.keys(content).length; i++) {
      const inputElement = document.getElementsByName(
        `item_${i}`
      )[0] as HTMLInputElement;
      const oldName = inputElement.getAttribute('data-attr');
      const newName = path + inputElement.value;

      if (oldName !== newName) {
        axios
          .post(
            'http://localhost:8000/api/rename_file',
            JSON.stringify({ old_name: oldName, new_name: newName })
          )
          .catch((error) => {
            console.warn(error);
          });
      }
    }

    setTimeout(() => {
      this.resetItems('left');
      this.resetItems('right');
      this.showSuccess(
        'Files renamed. Renames resulting in duplicates were ignored.'
      );
    }, 100);
  }

  moveUpOne(side: string) {
    if (side === 'left') {
      axios
        .post(
          'http://localhost:8000/api/move_one_up',
          JSON.stringify({ current_path: this.left_current_path })
        )
        .then((response: any) => {
          if (response.status === 200) {
            this.left_current_path = response.data['new_path'];
            this.resetItems(side);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    } else {
      axios
        .post(
          'http://localhost:8000/api/move_one_up',
          JSON.stringify({ current_path: this.right_current_path })
        )
        .then((response: any) => {
          if (response.status === 200) {
            this.right_current_path = response.data['new_path'];
            this.resetItems(side);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }

  deleteSelected(side: string) {
    let elements = Array.from(document.getElementsByClassName('selected')!);
    if (side === 'left') {
      return new Promise<void>((resolve, reject) => {
        for (let element of elements) {
          //@ts-ignore
          if (element.attributes['id'].value.toString().startsWith('left')) {
            //@ts-ignore
            let item_location = element.attributes['location'].value.toString();
            //@ts-ignore
            if (element.attributes['item-type'].value.toString() === 'file') {
              axios.post(
                'http://localhost:8000/api/delete_file',
                JSON.stringify({ file_name: item_location })
              );
            } else {
              axios.post(
                'http://localhost:8000/api/delete_folder',
                JSON.stringify({ folder_name: item_location })
              );
            }
          }
        }
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            this.resetItems('right');
            this.resetItems('left');
          }, 200);
          this.showSuccess('Selected files deleted successfully!');
        })
        .catch(() => {
          this.showFailure('Error deleting files. Check server log.');
        });
    } else {
      return new Promise<void>((resolve, reject) => {
        for (let element of elements) {
          //@ts-ignore
          if (element.attributes['id'].value.toString().startsWith('right')) {
            //@ts-ignore
            //@ts-ignore
            let item_location = element.attributes['location'].value.toString();
            //@ts-ignore
            if (element.attributes['item-type'].value.toString() === 'file') {
              axios.post(
                'http://localhost:8000/api/delete_file',
                JSON.stringify({ file_name: item_location })
              );
            } else {
              axios.post(
                'http://localhost:8000/api/delete_folder',
                JSON.stringify({ folder_name: item_location })
              );
            }
          }
        }
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            this.resetItems('right');
            this.resetItems('left');
          }, 200);
          this.showSuccess('Selected files deleted successfully!');
        })
        .catch(() => {
          this.showFailure('Error deleting files. Check server log.');
        });
    }
  }

  doEditOnItem() {
    const textArea = document.getElementById(
      'edit-file-textarea'
    )! as HTMLTextAreaElement;
    const location = textArea.getAttribute('data-location');
    const content = textArea.value;
    axios
      .post(
        'http://localhost:8000/api/save_file_content',
        JSON.stringify({
          file_name: location,
          content: content,
        })
      )
      .then((response: any) => {
        this.showSuccess('File edited successfully.');
        this.hideModal('edit-file-modal');
      })
      .catch((error: any) => {
        this.showFailure('Edit failed. Check console output.');
        this.hideModal('edit-file-modal');
      });
  }

  copySelected(source: string) {
    let elements = Array.from(document.getElementsByClassName('selected')!);
    if (source === 'left') {
      return new Promise<void>((resolve, reject) => {
        for (let element of elements) {
          //@ts-ignore
          if (element.attributes['id'].value.toString().startsWith('left')) {
            //@ts-ignore
            let item_location = element.attributes['location'].value.toString();
            //@ts-ignore
            if (element.attributes['item-type'].value.toString() === 'file') {
              axios.post(
                'http://localhost:8000/api/copy_file',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.right_current_path,
                })
              );
            } else {
              axios.post(
                'http://localhost:8000/api/copy_folder',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.right_current_path,
                })
              );
            }
          }
        }
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            this.resetItems('left');
            this.resetItems('right');
          }, 200);
          this.showSuccess('Selected files copied successfully!');
        })
        .catch(() => {
          this.showFailure('Error deleting files. Check server log.');
        });
    } else {
      return new Promise<void>((resolve, reject) => {
        for (let element of elements) {
          //@ts-ignore
          if (element.attributes['id'].value.toString().startsWith('right')) {
            //@ts-ignore
            let item_location = element.attributes['location'].value.toString();
            //@ts-ignore
            if (element.attributes['item-type'].value.toString() === 'file') {
              axios.post(
                'http://localhost:8000/api/copy_file',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.left_current_path,
                })
              );
            } else {
              axios.post(
                'http://localhost:8000/api/copy_folder',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.left_current_path,
                })
              );
            }
          }
        }
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            this.resetItems('left');
            this.resetItems('right');
          }, 200);
          this.showSuccess('Selected files copied successfully!');
        })
        .catch(() => {
          this.showFailure('Error deleting files. Check server log.');
        });
    }
  }

  moveSelected(source: string) {
    let elements = Array.from(document.getElementsByClassName('selected')!);
    if (source === 'left') {
      return new Promise<void>((resolve, reject) => {
        for (let element of elements) {
          //@ts-ignore
          if (element.attributes['id'].value.toString().startsWith('left')) {
            //@ts-ignore
            let item_location = element.attributes['location'].value.toString();
            //@ts-ignore
            if (element.attributes['item-type'].value.toString() === 'file') {
              axios.post(
                'http://localhost:8000/api/move_file',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.right_current_path,
                })
              );
            } else {
              axios.post(
                'http://localhost:8000/api/move_folder',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.right_current_path,
                })
              );
            }
          }
        }
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            this.resetItems('left');
            this.resetItems('right');
          }, 200);
          this.showSuccess('Selected files copied successfully!');
        })
        .catch(() => {
          this.showFailure('Error deleting files. Check server log.');
        });
    } else {
      return new Promise<void>((resolve, reject) => {
        for (let element of elements) {
          //@ts-ignore
          if (element.attributes['id'].value.toString().startsWith('right')) {
            //@ts-ignore
            let item_location = element.attributes['location'].value.toString();
            //@ts-ignore
            if (element.attributes['item-type'].value.toString() === 'file') {
              axios.post(
                'http://localhost:8000/api/move_file',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.left_current_path,
                })
              );
            } else {
              axios.post(
                'http://localhost:8000/api/move_folder',
                JSON.stringify({
                  old_name: item_location,
                  new_name: this.left_current_path,
                })
              );
            }
          }
        }
        resolve();
      })
        .then(() => {
          setTimeout(() => {
            this.resetItems('left');
            this.resetItems('right');
          }, 200);
          this.showSuccess('Selected files copied successfully!');
        })
        .catch(() => {
          this.showFailure('Error deleting files. Check server log.');
        });
    }
  }

  changeDirectory(side: string, path: HTMLFormElement) {
    const content = Object.fromEntries(new FormData(path) as any) as any;
    axios
      .post(
        'http://localhost:8000/api/change_path_to',
        JSON.stringify({ path: content['terminal'] })
      )
      .then((response) => {
        if (response.data['message'] === 'Path does not exist') {
          this.showFailure('Given path does not exist!');
        } else if (response.data['message'] === 'Path is not a directory') {
          this.showFailure('Given path is not a directory!');
        } else if (response.data['message'] === 'Path is not absolute') {
          this.showFailure('Given path is not absolute!');
        } else {
          if (side === 'left') {
            this.left_current_path = content['terminal'];
          } else {
            this.right_current_path = content['terminal'];
          }
        }
        setTimeout(() => {
          this.resetItems('left');
          this.resetItems('right');
        }, 100);
      })
      .catch((error) => {});
  }

  private showSuccess(message: string) {
    document.getElementById('success-msg')!.innerHTML = message;
    document.getElementById('success-modal')!.classList.remove('is-invisible');
    setTimeout(() => {
      document.getElementById('success-modal')!.classList.add('is-invisible');
      document.getElementById('success-msg')!.innerHTML = '';
    }, 2000);
  }

  private showFailure(message: string) {
    document.getElementById('failure-msg')!.innerHTML = message;
    document.getElementById('failure-modal')!.classList.remove('is-invisible');
    setTimeout(() => {
      document.getElementById('failure-modal')!.classList.add('is-invisible');
      document.getElementById('failure-msg')!.innerHTML = '';
    }, 2000);
  }
}
