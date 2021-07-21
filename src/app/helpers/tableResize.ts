import { ElementRef } from '@angular/core';


export function measureTableHeight(myTable: ElementRef): number {
  const win = window.innerHeight;

  const table = myTable.nativeElement as HTMLTableElement;
  if (!table) { return; }

  const realTopCard = table.offsetTop;

  let rowsNumber = 0;
  if (table && table.rows) { rowsNumber = table.rows.length; }

  let averageHeight = 45;

  if (rowsNumber > 1) {

    let rowsHeight = 0;
    for (let i = 1; i < rowsNumber; i++) {
      rowsHeight += table.rows[i].clientHeight;
    }

    averageHeight = Math.round(rowsHeight / rowsNumber);
  }


  const tableHeight = win - (realTopCard + (9 * 26));
  const addLine = Math.round(tableHeight / averageHeight);

  return addLine;
}
