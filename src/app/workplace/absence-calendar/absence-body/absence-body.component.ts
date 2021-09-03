import { AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CalendarHeaderDayRank } from 'src/app/core/calendar-class';
import { MDraw } from 'src/app/helpers/draw-helper';
import { BaselineAlignmentEnum, TextAlignmentEnum } from 'src/app/helpers/enums/cell-settings.enum';
import { Gradient3DBorderStyleEnum } from 'src/app/helpers/enums/draw.enum';
import { addDays, EqualDate, getDaysInMonth, isLeapYear } from 'src/app/helpers/format-helper';
import { Rectangle } from 'src/app/helpers/geometry';
import { myPosition } from 'src/app/helpers/position';
import { HolidayDate } from 'src/app/template/classes/holyday-list';
import { CalendarData } from '../absence-classes/data-calendar';
import { ScrollCalendar } from '../absence-classes/scroll-calendar';
import { CalHScrollbarComponent } from '../h-scrollbar/h-scrollbar.component';
import { CalVScrollbarComponent } from '../v-scrollbar/v-scrollbar.component';

@Component({
  selector: 'app-absence-body',
  templateUrl: './absence-body.component.html',
  styleUrls: ['./absence-body.component.scss']
})
export class AbsenceBodyComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() calendarData: CalendarData | undefined;
  @Input() vScrollbar: CalVScrollbarComponent | undefined;
  @Input() hScrollbar: CalHScrollbarComponent | undefined;
  @Input() scrollCalendar: ScrollCalendar | undefined;


  resizeWindow: (() => void) | undefined;
  visibilitychangeWindow: (() => void) | undefined;

  private ctx: CanvasRenderingContext2D | undefined;
  private renderCanvasCtx: CanvasRenderingContext2D | undefined;
  private canvas: HTMLCanvasElement | undefined;
  private renderCanvas: HTMLCanvasElement | undefined;
  private headerCtx: CanvasRenderingContext2D | undefined;
  private rowCanvas: HTMLCanvasElement | undefined;
  private backgroundRowCtx: CanvasRenderingContext2D | undefined;
  private headerCanvas: HTMLCanvasElement | undefined;
  private tooltip: HTMLDivElement | undefined;
  private startDate: Date = new Date;
  private holidayList: HolidayDate[] | undefined;


  isFocused = true;
  isBusy = false;
  isShift = false;
  isCtrl = false;

  private _selectedRow = -1;


  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
  ) { }

  /* #region ng */

  ngOnInit(): void {

    this.resizeWindow = this.renderer.listen('window', 'resize', (event: any) => {
      this.resize(event);
    });

    this.visibilitychangeWindow = this.renderer.listen('window', 'visibilitychange', (event: any) => {
      this.visibilityChange(event);
    });

    this.canvas! = document.getElementById('calendarCanvas') as HTMLCanvasElement;
    this.renderCanvas! = document.createElement('canvas') as HTMLCanvasElement;
    this.headerCanvas! = document.createElement('canvas') as HTMLCanvasElement;
    this.rowCanvas! = document.createElement('canvas') as HTMLCanvasElement;

    this.ctx! = this.canvas!.getContext('2d') as CanvasRenderingContext2D;
    MDraw.createHiDPICanvas(this.ctx!);
    MDraw.setAntiAliasing(this.ctx!);
    this.ctx!.imageSmoothingQuality = 'high';


    this.renderCanvasCtx = this.renderCanvas!.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    MDraw.createHiDPICanvas(this.renderCanvasCtx!);
    MDraw.setAntiAliasing(this.renderCanvasCtx!);
    this.renderCanvasCtx.imageSmoothingQuality = 'high';

    this.headerCtx = this.headerCanvas!.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    MDraw.createHiDPICanvas(this.headerCtx!);
    MDraw.setAntiAliasing(this.headerCtx!);
    this.headerCtx.imageSmoothingQuality = 'high';

    this.backgroundRowCtx = this.rowCanvas!.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    MDraw.createHiDPICanvas(this.backgroundRowCtx!);
    MDraw.setAntiAliasing(this.backgroundRowCtx!);
    this.backgroundRowCtx.imageSmoothingQuality = 'high';


    this.tooltip = document.getElementById('tooltip') as HTMLDivElement;


  }

  ngAfterViewInit(): void {
    //  this.calendarData!.calendarSetting!.backGroundColor = this.readProperty('$gridBackgroundColor');
    this.scrollCalendar!.maxCols = isLeapYear(this.calendarData!.calendarSetting!.currentYear) ? 366 : 365;
    this.scrollCalendar!.maxRows = 200;

    this.calendarData!.calendarSetting!.zoomChangingEvent.subscribe(() => {
      this.resetAll();
    });
    this.calendarData!.calendarSetting!.holidayListIsreadEvent.subscribe(() => {
      this.holidayList = this.calendarData!.calendarSetting!.holidaysList!.holidayList;
      this.resetAll();
    });

    this.calendarData!.isResetEvent.subscribe(() => {
      if (this.calendarData!) {
        this.scrollCalendar!.maxRows = this.calendarData!.rows;
        this.vScrollbar!.maximumRow = this.calendarData!.rows;
        this.scrollCalendar!.setMetrics(this.visibleCol(), this.scrollCalendar!.maxCols, this.visibleRow(), this.scrollCalendar!.maxRows);
        this.calendarData.reset();
        this.resetAll();
      }
    });


    this.resetAll();
  }

  ngOnDestroy(): void {

    if (this.resizeWindow) { this.resizeWindow(); }
    if (this.visibilitychangeWindow) { this.visibilitychangeWindow(); }

    this.calendarData = undefined;
    this.ctx = undefined;
    this.canvas = undefined;
    this.renderCanvas = undefined;
    this.headerCanvas = undefined;
    this.tooltip = undefined;

  }


  private resetAll(): void {
    this.canvas!.height = this.canvas!.clientHeight;
    this.canvas!.width = this.canvas!.clientWidth;
    this.setMetrics();
    this.createRuler();
    this.renderCalendar();
  }
  /* #endregion ng */

  /* #region   resize+visibility */
  private resize = (event: any): void => {

    this.setMetrics();
    this.refreshCalendar();
    this.drawCalendar();

  }

  private visibilityChange = (event: any): void => {
    this.setMetrics();
    this.refreshCalendar();
    this.drawCalendar();

  }

  onResize(): void {
    this.setMetrics();
    this.refreshCalendar();
  }


  /* #endregion   resize+visibility */

  /* #region   metrics */

  private setMetrics(): void {
    this.calendarData!.calendarSetting!.reset();

    const visibleRows: number =
      Math.floor(this.canvas!.clientHeight / this.calendarData!.calendarSetting!.cellHeight) - 1;
    const visibleCols: number =
      Math.floor(this.canvas!.clientWidth / this.calendarData!.calendarSetting!.cellWidth) - 1;
    this.scrollCalendar!.setMetrics(
      visibleCols,
      this.calendarData!.columns,
      visibleRows,
      this.calendarData!.rows
    );
    this.vScrollbar!.refresh();
    this.hScrollbar!.refresh();
  }

  visibleCol(): number {
    return Math.ceil(
      this.canvas!.clientWidth / this.calendarData!.calendarSetting!.cellWidth
    );
  }

  visibleRow(): number {
    return Math.ceil(
      this.canvas!.clientHeight / this.calendarData!.calendarSetting!.cellHeight
    );
  }

  firstVisibleColumn(): number {
    return this.hScrollbar!.value;
  }

  lastVisibleColumn(): number {
    return this.firstVisibleColumn() + this.visibleCol();
  }

  firstVisibleRow(): number {
    return this.vScrollbar!.value;
  }

  lastVisibleRow(): number {
    return this.firstVisibleRow() + this.visibleRow();
  }

  private getWith(): number {
    const year = isLeapYear(this.calendarData!.calendarSetting!.currentYear) ? 366 : 365;
    return this.calendarData!.calendarSetting!.cellWidth * year + 1;
  }

  get clientLeft(): number {
    return 0;
  }

  get clientTop(): number {
    return this.calendarData!.calendarSetting!.cellHeaderHeight;
  }

  get clientHeight(): number {
    return this.canvas!.clientHeight;
  }

  get clientWidth(): number {
    return this.canvas!.clientWidth;
  }

  holidayInfo(column: number): HolidayDate | undefined {
    const today = addDays(this.startDate, column);

    return this.holidayList!.find(x => EqualDate(x.currentDate, today) === 0);

  }

  /* #endregion   metrics */

  /* #region   select */

  onSelectByMouse(x: number, y: number) {
    const dy = y - this.calendarData!.calendarSetting!.cellHeaderHeight;
    const height = this.calendarData!.calendarSetting!.cellHeight;
    if (dy >= 0) {
      const tmpRow = Math.floor(dy / height);
      this.selectedRow = tmpRow + this.firstVisibleRow();
    }
  }

  set selectedRow(value: number) {

    if (value === this._selectedRow) { return; }


    this.unDrawSelectionRow();
    if (value < 0) {
      this._selectedRow = 0;
    } else if (value > this.calendarData!.rows) {
      this._selectedRow = this.calendarData!.rows;
    } else {
      this._selectedRow = value;
    }
    this.drawSelectionRow();
  }

  get selectedRow() {
    return this._selectedRow;
  }

  drawSelectionRow(): void {
    if (this.selectedRow > -1) {
      if (this.isSelectedRowVisible()) {
        this.ctx!.save();
        this.ctx!.globalAlpha = 0.2;
        this.ctx!.fillStyle = this.calendarData!.calendarSetting!.focusBorderColor;
        const dy = this.selectedRow - this.scrollCalendar!.vScrollValue
        const height = this.calendarData!.calendarSetting!.cellHeight
        const top = Math.floor(dy * height) + this.calendarData!.calendarSetting!.cellHeaderHeight;

        this.ctx!.fillRect(0, top, this.canvas!.width, height);

        this.ctx!.restore();

        this.calendarData!.selectRow = this.selectedRow;
      }
    }
  }


  unDrawSelectionRow(): void {
    if (this.selectedRow > -1) {
      if (this.isSelectedRowVisible())
        this.drawRowIntern(this.selectedRow);
    }
  }

  private isSelectedRowVisible(): boolean {
    if (this.selectedRow >= this.firstVisibleRow() && 
        this.selectedRow < (this.firstVisibleRow() + this.visibleRow()) && 
        this.selectedRow < this.calendarData!.rows) {

      return true;
    }

    return false;
  }
  /* #endregion   select */

  /* #region   render */

  renderCalendar(): void {

    if (!this.calendarData) { return };
    if (!this.calendarData!.calendarSetting) { return };

    const visibleRow = this.visibleRow();

    this.renderCanvas!.height = this.canvas!.clientHeight;
    this.renderCanvas!.width = this.getWith();
    const height = this.calendarData!.calendarSetting!.cellHeight

    for (let i = 0; i < visibleRow + 1; i++) {
      const ii = i + this.scrollCalendar!.vScrollValue!;
      this.drawRow(ii);
    }

    this.drawCalendar();
  }


  moveCalendar(directionX: number, directionY: number): void {
    if (this.isBusy) { return; }

    const dirX = directionX;
    const dirY = directionY;
    const visibleRow = Math.ceil(
      this.canvas!.clientHeight / this.calendarData!.calendarSetting!.cellHeight
    );

    this.scrollCalendar!.hScrollValue += dirX;
    this.scrollCalendar!.vScrollValue += dirY;

    this.zone.run(() => {
      try {
        this.isBusy = true;
        // horizontale Verschiebung
        if (dirX !== 0) {
          this.drawCalendar()
        }
        // vertikale Verschiebung
        if (dirY !== 0) {

          // Nach Unten
          if (dirY > 0) {

            if (dirY < visibleRow / 2) {
              this.moveIt(dirY);
              return;
            } else {
              this.renderCalendar();
              return;
            }
          }
          // Nach Oben
          if (dirY < 0) {
            if (dirY * -1 < visibleRow / 2) {
              this.moveIt(dirY);
              return;
            } else {
              this.renderCalendar();
            }
          }
        }
      } finally {
        this.isBusy = false;
      }
    });

    this.drawCalendar();

  }

  drawCalendar(): void {
    const dx = this.scrollCalendar!.hScrollValue * this.calendarData!.calendarSetting!.cellWidth * -1
    this.ctx!.clearRect(
      0,
      0,
      this.ctx!.canvas.width,
      this.ctx!.canvas!.height
    );
    this.ctx!.drawImage(this.headerCanvas!, dx, 0);
    this.ctx!.drawImage(this.renderCanvas!, dx, this.calendarData!.calendarSetting!.cellHeaderHeight);

    this.drawSelectionRow();
  }

  private moveIt(directionY: number): void {
    const visibleRow = this.scrollCalendar!.visibleRows;



    if (directionY !== 0) {

      const diff = this.scrollCalendar!.lastDifferenceY;
      if (diff === 0) {
        return;
      }

      const tempCanvas: HTMLCanvasElement = document.createElement(
        'canvas'
      ) as HTMLCanvasElement;
      tempCanvas.height = this.renderCanvas!.height;
      tempCanvas.width = this.renderCanvas!.width;

      const ctx = tempCanvas.getContext('2d');
      ctx!.drawImage(this.renderCanvas!, 0, 0);


      this.renderCanvasCtx!.clearRect(
        0,
        0,
        this.renderCanvas!.width,
        this.renderCanvas!.height
      );




      this.renderCanvasCtx!.drawImage(
        tempCanvas,
        0,
        this.calendarData!.calendarSetting!.cellHeight * diff
      );

      let firstRow = 0;
      let lastRow = 0;

      if (directionY > 0) {
        firstRow = visibleRow + this.scrollCalendar!.vScrollValue;
        lastRow = firstRow + (diff * -1) + 1;
      } else {
        firstRow = this.scrollCalendar!.vScrollValue;
        lastRow = firstRow + diff + 1;
      }

      for (let row = firstRow; row < lastRow; row++) {

        this.drawRow(row);

      }
    }

    this.drawCalendar();
  }

  private drawRow(index: number): void {

    const dy = index - this.scrollCalendar!.vScrollValue
    const height = this.calendarData!.calendarSetting!.cellHeight
    const top = Math.floor(dy * height);
    const rec = new Rectangle(0, top, this.renderCanvas!.width, top + height);

    this.drawRowSub(this.renderCanvasCtx!, index, rec);

  }

  private drawRowIntern(index: number): void {

    const dy = index - this.scrollCalendar!.vScrollValue
    const left = this.scrollCalendar!.hScrollValue * this.calendarData!.calendarSetting!.cellWidth * -1
    const height = this.calendarData!.calendarSetting!.cellHeight
    const top = Math.floor(dy * height) + this.calendarData!.calendarSetting!.cellHeaderHeight;
    const rec = new Rectangle(left, top, this.canvas!.width, top + height);

    this.drawRowSub(this.ctx!, index, rec);

  }

  private drawRowSub(ctx: CanvasRenderingContext2D, index: number, rec: Rectangle): void {

    if (index < this.calendarData!.rows) {
      ctx.drawImage(this.rowCanvas!, rec.x, rec.y);
    } else {
      MDraw.fillRectangle(ctx, this.calendarData!.calendarSetting!.backGroundColor, rec);
    }
  }

  /* #endregion   render */

  /* #region   draw */

  refreshCalendar(): void {

    this.canvas!.height = this.canvas!.clientHeight;
    this.canvas!.width = this.canvas!.clientWidth;

    const visibleRow = this.visibleRow();

    const height = visibleRow * this.calendarData!.calendarSetting!.cellHeight;

    if (this.renderCanvas!.height < height) {
      // this.onGrowGrid();
      this.renderCalendar();
    } else {
      this.renderCalendar();
    }
  }




  /* #endregion   draw */

  /* #region   create */

  private createRuler() {

    if (!this.calendarData) { return };
    if (!this.calendarData!.calendarSetting) { return };

    this.calendarData!.calendarSetting!.reset();
    this.startDate = new Date(this.calendarData!.calendarSetting!.currentYear, 0, 1);
    const year = isLeapYear(this.calendarData!.calendarSetting!.currentYear) ? 366 : 365;

    const cellHeight = this.calendarData!.calendarSetting!.cellHeight;
    this.rowCanvas!.height = cellHeight;
    const headerHeight = this.calendarData!.calendarSetting!.cellHeaderHeight;
    this.headerCanvas!.height = headerHeight;

    this.rowCanvas!.width = this.getWith();
    this.headerCanvas!.width = this.getWith();
    const rec = new Rectangle(0, 0, this.rowCanvas!.width, this.rowCanvas!.height);
    MDraw.fillRectangle(this.backgroundRowCtx!, this.calendarData!.calendarSetting!.backGroundColor, rec);

    let headerDayRank = new Array<CalendarHeaderDayRank>();
    let monthsRect = new Array<Rectangle>();

    let lastDays = 0;
    // durchläuft alle Monate im Jahr und zeichnet die Hintergrundsfarbe pro Monat
    for (let i = 0; i < 12; i++) {
      const actualDays = getDaysInMonth(this.calendarData!.calendarSetting!.currentYear, i)

      const l = lastDays * this.calendarData!.calendarSetting!.cellWidth;
      const l2 = actualDays * this.calendarData!.calendarSetting!.cellWidth;

      const rec1 = new Rectangle(l, 0, l + l2, this.rowCanvas!.height);
      lastDays += actualDays;

      MDraw.fillRectangle(this.backgroundRowCtx!, (i % 2 === 0 ? this.calendarData!.calendarSetting!.evenMonthColor : this.calendarData!.calendarSetting!.oddMonthColor), rec1);

      monthsRect.push(rec1);

    }

    for (let i = 0; i < year; i++) {


      const currDate = addDays(this.startDate, i);
      const d = i * this.calendarData!.calendarSetting!.cellWidth;
      const rec2 = new Rectangle(Math.floor(d), 0, Math.floor(d + this.calendarData!.calendarSetting!.cellWidth), this.calendarData!.calendarSetting!.cellHeaderHeight);

      let isHoliday = false;
      if (this.holidayList && this.holidayList!.length > 0) {
        const result = this.holidayList!.find(x => (EqualDate(x.currentDate, currDate) === 0));

        if (result) {
          isHoliday = true;
          MDraw.fillRectangle(this.backgroundRowCtx!, result!.officially ? this.calendarData!.calendarSetting!.holydayColorOfficially : this.calendarData!.calendarSetting!.holydayColor, rec2);

          MDraw.drawBaseBorder(
            this.backgroundRowCtx!,
            this.calendarData!.calendarSetting!.borderColor,
            this.calendarData!.calendarSetting!.increaseBorder, rec2);
        }

      }


      const borderSize = this.calendarData!.calendarSetting!.increaseBorder;
      switch (currDate.getDay()) {
        case 0:
          if (!isHoliday) {
            MDraw.fillRectangle(this.backgroundRowCtx!, this.calendarData!.calendarSetting!.sundayColor, rec2);

            MDraw.drawBaseBorder(
              this.backgroundRowCtx!,
              this.calendarData!.calendarSetting!.borderColor,
              this.calendarData!.calendarSetting!.increaseBorder, rec2);
          }


          const c = new CalendarHeaderDayRank();
          c.name = currDate.getDate().toString();
          c.rect = new Rectangle(d, this.rowCanvas!.height + borderSize, d + 20, this.rowCanvas!.height + (this.headerCanvas!.height - this.rowCanvas!.height));
          c.backColor = this.calendarData!.calendarSetting!.sundayColor;

          headerDayRank.push(c)


          break;
        case 6:
          if (!isHoliday) {
            MDraw.fillRectangle(this.backgroundRowCtx!, this.calendarData!.calendarSetting!.saturdayColor, rec2);

            MDraw.drawBaseBorder(
              this.backgroundRowCtx!,
              this.calendarData!.calendarSetting!.borderColor,
              this.calendarData!.calendarSetting!.increaseBorder, rec2);
          }

          const c1 = new CalendarHeaderDayRank();
          c1.name = currDate.getDate().toString();
          c1.rect = new Rectangle(rec2.right - 20, this.rowCanvas!.height + borderSize, rec2.right, this.rowCanvas!.height + (this.headerCanvas!.height - this.rowCanvas!.height));
          c1.backColor = this.calendarData!.calendarSetting!.saturdayColor;

          headerDayRank.push(c1)


          break;
        default:
          MDraw.drawBaseBorder(
            this.backgroundRowCtx!,
            this.calendarData!.calendarSetting!.borderColor,
            0.5, rec2);
      }

    }

    this.backgroundRowCtx!.save();
    this.backgroundRowCtx!.lineWidth = 1;
    this.backgroundRowCtx!.strokeStyle = this.calendarData!.calendarSetting!.borderColorEndMonth;
    monthsRect.forEach((x) => {

      this.backgroundRowCtx!.moveTo(x.left, x.top);
      this.backgroundRowCtx!.lineTo(x.left, x.bottom);
      this.backgroundRowCtx!.stroke();
    });
    this.backgroundRowCtx!.restore();

    //this.headerCtx!.drawImage(this.rowCanvas!, 0, 0);
    this.headerCtx!.drawImage(this.rowCanvas!, 0, this.rowCanvas!.height);

    //Zeichne Monatstage am Samstag und Sonntag
    if (this.calendarData!.calendarSetting!.cellWidth * 2 >= 20) {
      headerDayRank.forEach(x => {
        MDraw.fillRectangle(this.headerCtx!, x.backColor, x.rect);
        MDraw.drawText(
          this.headerCtx!,
          x.name,
          x.rect.left,
          x.rect.top,
          x.rect.width,
          x.rect.height,
          this.calendarData!.calendarSetting!.firstSubFontFont,
          this.calendarData!.calendarSetting!.firstSubFontSize,
          this.calendarData!.calendarSetting!.foreGroundColor,
          TextAlignmentEnum.Center,
          BaselineAlignmentEnum.Center);
      });
    }

    // Zeichne Monatsbalken mit Monatsnamen
    lastDays = 0;
    for (let i = 0; i < 12; i++) {

      const actualDays = getDaysInMonth(this.calendarData!.calendarSetting!.currentYear, i)

      const l = lastDays * this.calendarData!.calendarSetting!.cellWidth;
      const l2 = actualDays * this.calendarData!.calendarSetting!.cellWidth;
      const rec3 = new Rectangle(l, 0, l + l2, this.rowCanvas!.height);
      lastDays += actualDays;
      MDraw.fillRectangle(this.headerCtx!, this.calendarData!.calendarSetting!.controlBackGroundColor, rec3);

      MDraw.drawText(
        this.headerCtx!,
        this.calendarData!.monthsName[i],
        rec3.left,
        rec3.top,
        rec3.width,
        rec3.height,
        this.calendarData!.calendarSetting!.font,
        this.calendarData!.calendarSetting!.mainFontSize,
        this.calendarData!.calendarSetting!.foreGroundColor,
        TextAlignmentEnum.Center,
        BaselineAlignmentEnum.Center);

      MDraw.drawBorder(this.headerCtx!, rec3.left, rec3.top, rec3.width, rec3.height, this.calendarData!.calendarSetting!.controlBackGroundColor, 2, Gradient3DBorderStyleEnum.Raised)

      this.ctx!.drawImage(this.headerCanvas!, 0, 0);
    }


  }
  /* #endregion   create */

  /* #region position and selection */

  setShiftKey(): void {
    if (!this.isShift) {
      this.isShift = true;
      // this.AnchorKeyPosition = this.position;
    }
  }

  unSetShiftKey(): void {

    this.isShift = false;
    // this.AnchorKeyPosition = undefined;
  }

  calcCorrectCoordinate(event: MouseEvent) {
    let row = -1;
    let col = -1;
    const rect = this.canvas!.getBoundingClientRect();
    const x: number = event.clientX - rect.left;
    const y: number = event.clientY - rect.top;

    if (y >= this.calendarData!.calendarSetting!.cellHeaderHeight) {

      row =
        Math.floor(
          (y - this.calendarData!.calendarSetting!.cellHeaderHeight) / this.calendarData!.calendarSetting!.cellHeight
        ) + this.scrollCalendar!.vScrollValue;
      col =
        Math.floor(x / this.calendarData!.calendarSetting!.cellWidth) + this.scrollCalendar!.hScrollValue;
    }

    return new myPosition(row, col);
  }

  /* #endregion position and selection */

  /* #region ToolTips */
  showToolTip(value: string, event: MouseEvent): void {
    if (this.tooltip && this.tooltip!.innerHTML !== value) {
      this.tooltip!.innerHTML = value;

      this.tooltip!.style.display = 'block';
      this.tooltip!.style.opacity = '1';
      this.tooltip!.style.visibility = 'visible';
    }

    this.tooltip!.style.top = event.clientY + 'px';
    this.tooltip!.style.left = event.clientX + 'px';
  }

  hideToolTip() {
    this.destroyToolTip();
  }



  destroyToolTip() {
    this.tooltip!.style.opacity = '0';
    this.tooltip!.style.display = 'none';
    this.tooltip!.innerHTML = '';
    this.tooltip!.style.top = '-9000px';
    this.tooltip!.style.left = '-9000px';
    this.tooltip!.style.visibility = 'hidden';

  }
  /* #endregion ToolTips */

  private readProperty(name: string): string {
    let bodyStyles = window.getComputedStyle(document.body);
    return bodyStyles.getPropertyValue(name);
  }

  onClick(event: MouseEvent) {
    document.getElementById('calendarCanvas')!.focus();
  }
}



