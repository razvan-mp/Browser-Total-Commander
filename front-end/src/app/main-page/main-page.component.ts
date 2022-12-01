import {Component} from '@angular/core';
import axios from 'axios';
import {ItemModel} from "../../assets/models/ItemModel";

@Component({
  selector: 'app-main-page', templateUrl: './main-page.component.html', styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  title = 'main-page';

  left_side_file_list: Array<ItemModel> = [];
  right_side_file_list: Array<ItemModel> = [];
  left_current_path: string = '';
  right_current_path: string = '';

  constructor() {
  }

  ngOnInit() {
    this.left_current_path = '.';
    this.right_current_path = '.';
    this.resetItems('left');
    this.resetItems('right');
  }

  addItemToQueue(item_id: string) {
    const element = document.getElementById(item_id)!;
    if (element.classList.contains('selected')) element.classList.remove('selected'); else element.classList.add('selected');
  }

  resetItems(side: string) {
    if (side == 'left') {
      this.left_side_file_list = [];
      axios.post('http://localhost:8000/api/get_files', JSON.stringify({path: this.left_current_path})).then((response: any) => {
        for (const responseElement of response.data) {
          let item = new ItemModel(responseElement['path'], responseElement['last_accessed'], responseElement['size'], responseElement['type'])
          this.left_side_file_list.push(item);
        }
      }).catch((error: any) => {
        console.log(error);
      });
    } else {
      this.right_side_file_list = [];
      axios.post('http://localhost:8000/api/get_files', JSON.stringify({path: this.right_current_path})).then((response: any) => {
        for (const responseElement of response.data) {
          let item = new ItemModel(responseElement['path'], responseElement['last_accessed'], responseElement['size'], responseElement['type'])
          this.right_side_file_list.push(item);
        }
      }).catch((error: any) => {
        console.log(error);
      });
    }
  }

  openModal(modal_id: string, item_path: string) {
    if (modal_id === 'edit-file-modal') {
      axios.post('http://localhost:8000/api/get_file_content', JSON.stringify({file_name: item_path})).then((response: any) => {
        const textArea = document.getElementById('edit-file-textarea')!;
        // @ts-ignore
        textArea.value = response.data['content'];
        textArea.setAttribute('data-location', item_path);
      }).catch((error: any) => {
        console.error(error);
        this.showFailure('Failed to open file. Check console output.');
      });
    }
    const elementStyle = "  background: white;\n" +
      "  outline: none;\n" +
      "  border: none;\n" +
      "  padding: 10px;\n" +
      "  font-family: 'Inter', sans-serif;\n" +
      "  box-shadow: 0 3px 10px 1px rgba(0, 0, 0, 0.2);\n" +
      "  font-size: 1rem;\n" +
      "  border-radius: 10px;";
    let elements = Array.from(document.getElementsByClassName('selected')!);
    if (modal_id === 'rename-file-left-modal') {
      const inputDiv = document.getElementById('rename-file-left-inputs')!;
      let folder_count = 0;
      let file_count = 0;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].attributes['id' as any].value.toString().startsWith('left')) {
          const name = elements[i].attributes['location' as any].value.toString().split('\\').pop()!;
          if (elements[i].attributes['item-type' as any].value.toString() === 'folder') {
            inputDiv.innerHTML += "<label class=\"label\">Folder name</label>" +
              "<input name=\"folder_name_" + folder_count + "\" style=\"" + elementStyle + "\" value=\""
              + name
              + "\">";
            folder_count++;
          } else {
            inputDiv.innerHTML += "<label class=\"label\">File name & extension</label>" +
              "<div style='display: flex; flex-direction: row; gap: 5px; align-items: baseline;'>" +
              "<input name=\"file_name_" + file_count + "\" style=\"" + elementStyle + "\" value=\""
              + name.replace(/\.[^/.]+$/, "")
              + "\"><p style='font-weight: 600;'>.</p>" +
              "<input name=\"file_extension_" + file_count + "\" style=\"" + elementStyle + "\" value=\""
              + name.split('.').pop() + "\"></div>";
            file_count++;
          }
        }
      }
    } else if (modal_id === 'rename-file-right-modal') {
      const inputDiv = document.getElementById('rename-file-right-inputs')!;
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].attributes['id' as any].value.toString().startsWith('right')) {
          const name = elements[i].attributes['location' as any].value.toString().split('\\').pop()!;
          if (elements[i].attributes['item-type' as any].value.toString() === 'folder') {
            inputDiv.innerHTML += "<label class=\"label\">Folder name</label>" +
              "<input style=\"" + elementStyle + "\" value=\""
              + name
              + "\">"
          } else {
            inputDiv.innerHTML += "<label class=\"label\">File name & extension</label>" +
              "<div style='display: flex; flex-direction: row; gap: 5px; align-items: baseline;'>" +
              "<input style=\"" + elementStyle + "\" value=\""
              + name.replace(/\.[^/.]+$/, "")
              + "\"><p style='font-weight: 600;'>.</p>" +
              "<input style=\"" + elementStyle + "\" value=\""
              + name.split('.').pop() + "\"></div>"
          }
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

    axios.post('http://localhost:8000/api/create_file', JSON.stringify({file_name: path})).then((response: any) => {
      if (response.status == 200) {
        this.showSuccess('File created successfully!');
      }
      this.resetItems(side);
    }).catch((error: any) => {
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

    axios.post('http://localhost:8000/api/create_folder', JSON.stringify({folder_name: path})).then((response: any) => {
      if (response.status == 200) {
        this.showSuccess('Folder created successfully!');
      }
      this.resetItems(side);
    }).catch((error: any) => {
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
    const content = Object.fromEntries(new FormData(renameFileForm) as any) as any;
    console.log(content);
  }

  moveUpOne(side: string) {
    if (side === 'left') {
      axios.post('http://localhost:8000/api/move_one_up', JSON.stringify({current_path: this.left_current_path})).then((response: any) => {
        if (response.status === 200) {
          this.left_current_path = response.data['new_path'];
          this.resetItems(side);
        }
      }).catch((error: any) => {
        console.log(error);
      });
    } else {
      axios.post('http://localhost:8000/api/move_one_up', JSON.stringify({current_path: this.right_current_path})).then((response: any) => {
        if (response.status === 200) {
          this.right_current_path = response.data['new_path'];
          this.resetItems(side);
        }
      }).catch((error: any) => {
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
              axios.post('http://localhost:8000/api/delete_file', JSON.stringify({file_name: item_location}));
            } else {
              axios.post('http://localhost:8000/api/delete_folder', JSON.stringify({folder_name: item_location}));
            }
          }
        }
        resolve();
      }).then(() => {
        setTimeout(() => {
          this.resetItems('right');
          this.resetItems('left');
        }, 200);
        this.showSuccess('Selected files deleted successfully!');
      }).catch(() => {
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
              axios.post('http://localhost:8000/api/delete_file', JSON.stringify({file_name: item_location}));
            } else {
              axios.post('http://localhost:8000/api/delete_folder', JSON.stringify({folder_name: item_location}));
            }
          }
        }
        resolve();
      }).then(() => {
        setTimeout(() => {
          this.resetItems('right');
          this.resetItems('left');
        }, 200);
        this.showSuccess('Selected files deleted successfully!');
      }).catch(() => {
        this.showFailure('Error deleting files. Check server log.');
      });
    }
  }

  doEditOnItem() {
    const textArea = document.getElementById('edit-file-textarea')! as HTMLTextAreaElement;
    const location = textArea.getAttribute('data-location');
    const content = textArea.value;
    axios.post('http://localhost:8000/api/save_file_content', JSON.stringify({
      file_name: location,
      content: content
    })).then((response: any) => {
      this.showSuccess('File edited successfully.');
      this.hideModal('edit-file-modal');
    }).catch((error: any) => {
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
              axios.post('http://localhost:8000/api/copy_file', JSON.stringify({
                old_name: item_location,
                new_name: this.right_current_path
              }));
            } else {
              axios.post('http://localhost:8000/api/copy_folder', JSON.stringify({
                old_name: item_location,
                new_name: this.right_current_path
              }));
            }
          }
        }
        resolve();
      }).then(() => {
        setTimeout(() => {
          this.resetItems('left');
          this.resetItems('right');
        }, 200);
        this.showSuccess('Selected files copied successfully!');
      }).catch(() => {
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
              axios.post('http://localhost:8000/api/copy_file', JSON.stringify({
                old_name: item_location,
                new_name: this.left_current_path
              }));
            } else {
              axios.post('http://localhost:8000/api/copy_folder', JSON.stringify({
                old_name: item_location,
                new_name: this.left_current_path
              }));
            }
          }
        }
        resolve();
      }).then(() => {
        setTimeout(() => {
          this.resetItems('left');
          this.resetItems('right');
        }, 200);
        this.showSuccess('Selected files copied successfully!');
      }).catch(() => {
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
              axios.post('http://localhost:8000/api/move_file', JSON.stringify({
                old_name: item_location,
                new_name: this.right_current_path
              }));
            } else {
              axios.post('http://localhost:8000/api/move_folder', JSON.stringify({
                old_name: item_location,
                new_name: this.right_current_path
              }));
            }
          }
        }
        resolve();
      }).then(() => {
        setTimeout(() => {
          this.resetItems('left');
          this.resetItems('right');
        }, 200);
        this.showSuccess('Selected files copied successfully!');
      }).catch(() => {
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
              axios.post('http://localhost:8000/api/move_file', JSON.stringify({
                old_name: item_location,
                new_name: this.left_current_path
              }));
            } else {
              axios.post('http://localhost:8000/api/move_folder', JSON.stringify({
                old_name: item_location,
                new_name: this.left_current_path
              }));
            }
          }
        }
        resolve();
      }).then(() => {
        setTimeout(() => {
          this.resetItems('left');
          this.resetItems('right');
        }, 200);
        this.showSuccess('Selected files copied successfully!');
      }).catch(() => {
        this.showFailure('Error deleting files. Check server log.');
      });
    }
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
