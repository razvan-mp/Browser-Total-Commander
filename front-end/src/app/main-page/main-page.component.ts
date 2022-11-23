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
            axios.post('http://localhost:8000/api/delete_file', JSON.stringify({file_name: element.attributes['location'].value.toString()}));
          }
        }//@ts-ignore
        }).then(this.resetItems(side));
    } else {
      return new Promise(() => {
        for (let element of elements) {
          //@ts-ignore
          if (element.attributes['id'].value.toString().startsWith('right')) {
            //@ts-ignore
            axios.post('http://localhost:8000/api/delete_file', JSON.stringify({file_name: element.attributes['location'].value.toString()}));
          }
        }//@ts-ignore
      }).then(this.resetItems(side));
    }
  }
}
