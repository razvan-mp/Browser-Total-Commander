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
    this.left_current_path = 'D:\\Test\\Left';
    this.right_current_path = 'D:\\Test\\Right';
    this.resetItems('left');
    this.resetItems('right');
  }

  addItemToQueue(item_id: string) {
    const element = document.getElementById(item_id)!;
    // @ts-ignore
    console.log(element.attributes['location'])
    if (element.classList.contains('selected')) element.classList.remove('selected'); else element.classList.add('selected');
  }

  resetItems(side: string) {
    if (side == 'left') {
      this.left_side_file_list = [];
      axios.post('http://localhost:8000/api/get_files', JSON.stringify({path: this.left_current_path})).then((response) => {
        for (const responseElement of response.data) {
          let item = new ItemModel(responseElement['path'], responseElement['last_accessed'], responseElement['size'], responseElement['type'])
          this.left_side_file_list.push(item);
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.right_side_file_list = [];
      axios.post('http://localhost:8000/api/get_files', JSON.stringify({path: this.right_current_path})).then((response) => {
        for (const responseElement of response.data) {
          let item = new ItemModel(responseElement['path'], responseElement['last_accessed'], responseElement['size'], responseElement['type'])
          this.right_side_file_list.push(item);
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  deleteSelected(side: string) {
    let elements = Array.from(document.getElementsByClassName('selected')!);
    if (side === 'left') {
      return new Promise(() => {
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
        }//@ts-ignore
      }).then(this.resetItems(side));
    } else {
      return new Promise(() => {
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
        }//@ts-ignore
      }).then(this.resetItems(side));
    }
  }


  openModal(modal_id: string) {
    document.getElementById(modal_id)!.classList.add('is-active');
  }

  hideModal(modal_id: string) {
    document.getElementById(modal_id)!.classList.remove('is-active');
  }


  private showSuccess() {
    document.getElementById('success-modal')!.classList.remove('is-invisible');
    setTimeout(() => {
      document.getElementById('success-modal')!.classList.add('is-invisible');
    }, 2000);
  }

  private showFailure() {
    document.getElementById('failure-modal')!.classList.remove('is-invisible');
    setTimeout(() => {
      document.getElementById('failure-modal')!.classList.add('is-invisible');
    }, 2000);
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

    axios.post('http://localhost:8000/api/create_file', JSON.stringify({file_name: path})).then((response) => {
      if (response.status == 200) {
        this.showSuccess();
      }
      this.resetItems(side);
    }).catch((error) => {
      this.showFailure();
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

    axios.post('http://localhost:8000/api/create_folder', JSON.stringify({folder_name: path})).then((response) => {
      if (response.status == 200) {
        this.showSuccess();
      }
      this.resetItems(side);
    }).catch((error) => {
      this.showFailure();
    });

    newFolderForm.reset();
  }
}
