export class ItemModel {
  path: string;
  size: number;
  type: string;
  last_accessed: string;

  constructor(path: string, last_accessed: string, size: number, type: string) {
    this.path = path;
    this.size = size;
    this.last_accessed = last_accessed;
    this.type = type;
  }
}
