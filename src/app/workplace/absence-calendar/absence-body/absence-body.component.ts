import { AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MDraw } from 'src/app/helpers/draw-helper';
import { BaselineAlignmentEnum, TextAlignmentEnum } from 'src/app/helpers/enums/cell-settings.enum';
import { Gradient3DBorderStyleEnum } from 'src/app/helpers/enums/draw.enum';
import { addDays, getDaysInMonth, isLeapYear } from 'src/app/helpers/format-helper';
import { Rectangle } from 'src/app/helpers/geometry';
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

  private holidayList: HolidayDate[] | undefined;

  isFocused = true;
  isBusy = false;
  isShift = false;
  isCtrl = false;


  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
  ) { }

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
    
    
    this.setMetrics();

    this.scrollCalendar!.maxCols = isLeapYear(this.calendarData!.calendarSetting!.currentYear) ? 366 : 365;
    this.scrollCalendar!.maxRows = 200;
    
    this.canvas!.height = this.canvas!.clientHeight;
    this.canvas!.width = this.canvas!.clientWidth;
    this.createRuler();
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

  private resize = (event: any): void => {

    this.setMetrics();
    this.refreshCalendar();
    this.moveHorizontal();

  }

  private visibilityChange = (event: any): void => {
    this.setMetrics();
    this.refreshCalendar();
    this.moveHorizontal();

  }

  onResize(): void {
    this.setMetrics();
    this.refreshCalendar();
   
    
  }

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
  }

  refreshCalendar(): void {

    this.canvas!.height = this.canvas!.clientHeight;
    this.canvas!.width = this.canvas!.clientWidth;


    const visibleRow = this.visibleRow();
    const visibleCol = this.visibleCol();
    const height = visibleRow * this.calendarData!.calendarSetting!.cellHeight;
   
    if ( this.renderCanvas!.height < height) {
      // this.onGrowGrid();
      this.moveHorizontal();
    } else {
      //  this.renderGrid();
      this.moveHorizontal();
    }
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


  private createRuler() {
    // size Bitmap fpr Ruler
    this.calendarData!.calendarSetting!.reset();
    const firstDay = new Date(this.calendarData!.calendarSetting!.currentYear, 0, 1);
    const year = isLeapYear(this.calendarData!.calendarSetting!.currentYear) ? 366 : 365;

    this.rowCanvas!.height = this.calendarData!.calendarSetting!.cellHeight;
    this.headerCanvas!.height = this.calendarData!.calendarSetting!.cellHeaderHeight;

    this.rowCanvas!.width = this.calendarData!.calendarSetting!.cellWidth * year + 1;
    this.headerCanvas!.width = this.calendarData!.calendarSetting!.cellWidth * year + 1;
    const rec = new Rectangle(0, 0, this.rowCanvas!.width, this.rowCanvas!.height);
    MDraw.fillRectangle(this.backgroundRowCtx!, this.calendarData!.calendarSetting!.backGroundColor, rec);

    let lastDays = 0;
    // durchläuft alle Monate im Jahr
    for (let i = 0; i < 11; i++) {
      const actualDays = getDaysInMonth(this.calendarData!.calendarSetting!.currentYear, i)

      const l = lastDays * this.calendarData!.calendarSetting!.cellWidth;
      const l2 = actualDays * this.calendarData!.calendarSetting!.cellWidth;

      const rec1 = new Rectangle(l, 0, l + l2, this.rowCanvas!.height);
      lastDays += actualDays;

      MDraw.fillRectangle(this.backgroundRowCtx!, (i % 2 === 0 ? this.calendarData!.calendarSetting!.evenMonthColor : this.calendarData!.calendarSetting!.oddMonthColor), rec1);

      for (let i = 0; i < year; i++) {
        const currDate = addDays(firstDay, i + 1);
        const d = i * this.calendarData!.calendarSetting!.cellWidth;
        const rec2 = new Rectangle(d, 0, d + this.calendarData!.calendarSetting!.cellWidth, this.calendarData!.calendarSetting!.cellHeaderHeight);
        switch(currDate.getDay()){
           case 0:
            MDraw.fillRectangle(this.backgroundRowCtx!,  this.calendarData!.calendarSetting!.saturdayColor, rec2);
           break;
           case 6:
            MDraw.fillRectangle(this.backgroundRowCtx!,  this.calendarData!.calendarSetting!.sundayColor, rec2);
        }
       
        MDraw.drawBaseBorder(
          this.backgroundRowCtx!,
          this.calendarData!.calendarSetting!.borderColor,
          0.5, rec2);
      }
    }
  

    this.headerCtx!.drawImage(this.rowCanvas!, 0, 0);
    this.headerCtx!.drawImage(this.rowCanvas!, 0, this.rowCanvas!.height);

    lastDays = 0;
    for (let i = 0; i < 12; i++) {

      const actualDays = getDaysInMonth(this.calendarData!.calendarSetting!.currentYear, i)

      const l = lastDays * this.calendarData!.calendarSetting!.cellWidth;
      const l2 = actualDays * this.calendarData!.calendarSetting!.cellWidth;
      const rec3 = new Rectangle(l, 0, l + l2, this.rowCanvas!.height);
      lastDays += actualDays;
      MDraw.fillRectangle(this.headerCtx!, '#BDBDBD', rec3);

      MDraw.drawText(
        this.headerCtx!,
        this.calendarData!.monthsName[i],
        rec3.left,
        rec3.top,
        rec3.width,
        rec3.height, this.calendarData!.calendarSetting!.font,
        12,
        this.calendarData!.calendarSetting!.foreGroundColor,
        TextAlignmentEnum.Center,
        BaselineAlignmentEnum.Center);

      MDraw.drawBorder(this.headerCtx!, rec3.left, rec3.top, rec3.width, rec3.height, (i % 2 === 0 ? this.calendarData!.calendarSetting!.evenMonthColor : this.calendarData!.calendarSetting!.oddMonthColor), 2, Gradient3DBorderStyleEnum.Raised)

      this.ctx!.drawImage(this.headerCanvas!, 0, 0);
    }
  }

  renderCalendar():void{

  }

  
  moveCalendar(directionX: number, directionY: number): void {
    const dirX = directionX;
    const dirY = directionY;

    const visibleCol = this.visibleCol();
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
          this.moveHorizontal()
        }
        // vertikale Verschiebung
        if (dirY !== 0) {

          // Nach Unten
          if (dirY > 0) {

            if (dirY < visibleRow / 2) {
              //this.moveIt(dirX, dirY);
              return;
            } else {
              //this.drawGrid();
              return;
            }
          }
          // Nach Oben
          if (dirY < 0) {
            if (dirY * -1 < visibleRow / 2) {
              //this.moveIt(dirX, dirY);
              return;
            } else {
              //this.drawGrid();
            }
          }
        }
      } finally {
        this.isBusy = false;
      }
    });
  }

  moveHorizontal(): void {
    const dx = this.scrollCalendar!.hScrollValue * this.calendarData!.calendarSetting!.cellWidth * -1
    this.ctx!.clearRect(
      0,
      0,
      this.ctx!.canvas.width,
      this.ctx!.canvas!.height
    );
    this.ctx!.drawImage(this.headerCanvas!, dx, 0);
  }
}


