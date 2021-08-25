export class myPosition {


  private col: number;
  private _row: number;


  constructor(newRow: number, newCol: number) {
    this._row = newRow;
    this.col = newCol;
  }

  get column() {
    return this.col;
  }
  get row() {
    return this._row;
  }

  isEmpty(): boolean {
    if (this._row === null && this.col === null) { return true; }
    if (this._row === -1 && this.col === -1) { return true; }
    return false;
  }

  isEqual(pos: myPosition): boolean {

    if (this.column === pos.column && this.row === pos.row) { return true; }
    return false;
  }
}

export class myPositionCollection {
  private items: Array<myPosition>;

  constructor() {
    this.items = [];
  }

  count(): number {
    return this.items.length;
  }

  add(value: myPosition): void {
    this.items.push(value);
  }

  item(index: number): myPosition {
    return this.items[index];
  }
  clear(): void {
    if (this.items !== undefined) {
      this.items = [];
    }
  }

  minColumn(): number {
    return this.items.reduce((min, p) => p.column < min ? p.column : min, this.items[0].column);
  }
  maxColumn(): number {
    return this.items.reduce((max, p) => p.column > max ? p.column : max, this.items[0].column);
  }
  minRow(): number {
    return this.items.reduce((min, p) => p.row < min ? p.row : min, this.items[0].row);
  }
  maxRow(): number {
    return this.items.reduce((max, p) => p.row > max ? p.row : max, this.items[0].row);
  }

  contains(value: myPosition): boolean {
    return this.items.find(x => (x.column === value.column && x.row === value.row)) !== undefined;
  }
}


