import { AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MDraw } from 'src/app/helpers/draw-helper';
import { BaselineAlignmentEnum, TextAlignmentEnum } from 'src/app/helpers/enums/cell-settings.enum';
import { Gradient3DBorderStyleEnum } from 'src/app/helpers/enums/draw.enum';
import { Rectangle } from 'src/app/helpers/geometry';
import { CalendarData } from '../absence-classes/data-calendar';
import { ScrollCalendar } from '../absence-classes/scroll-calendar';

@Component({
  selector: 'app-absence-row-header',
  templateUrl: './absence-row-header.component.html',
  styleUrls: ['./absence-row-header.component.scss']
})
export class AbsenceRowHeaderComponent implements OnInit , AfterViewInit, OnDestroy {

  visibilitychangeWindow: (() => void) | undefined;

  @Input() calendarData: CalendarData | undefined;
  @Input() scrollCalendar: ScrollCalendar | undefined;

  private ctx: CanvasRenderingContext2D | undefined;
  private renderCanvasCtx: CanvasRenderingContext2D | undefined;
  private canvas: HTMLCanvasElement | undefined;
  private renderCanvas: HTMLCanvasElement | undefined;
  private headerCtx: CanvasRenderingContext2D | undefined;
  private rowCanvas: HTMLCanvasElement | undefined;
  private backgroundRowCtx: CanvasRenderingContext2D | undefined;
  private headerCanvas: HTMLCanvasElement | undefined;

  constructor(
    private zone: NgZone,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {

    this.visibilitychangeWindow = this.renderer.listen('window', 'visibilitychange', (event: any) => {
      this.visibilityChange(event);
    });

    this.canvas! = document.getElementById('rowHeaderCanvas') as HTMLCanvasElement;
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
  }

  ngAfterViewInit(): void {


    this.canvas!.height = this.canvas!.clientHeight;
    this.canvas!.width = this.canvas!.clientWidth;

    this.setMetrics();
    this.createRuler();

  }

  ngOnDestroy(): void {

    if (this.visibilitychangeWindow) { this.visibilitychangeWindow(); }

    this.calendarData = undefined;
    this.ctx = undefined;
    this.canvas = undefined;
    this.renderCanvas = undefined;
    this.headerCanvas = undefined;
   

  }
  onResize(): void {
    this.canvas!.height = this.canvas!.clientHeight;
    this.canvas!.width = this.canvas!.clientWidth;

    this.setMetrics();
    this.createRuler();
  }

  private visibilityChange = (event: any): void => {
    // this.setMetrics();
    // this.refreshCalendar();
    // this.moveHorizontal();

  }
  private createRuler() {

   
    this.headerCanvas!.height = this.calendarData!.calendarSetting!.cellHeaderHeight;

    this.headerCanvas!.width = this.canvas!.clientWidth;
    const rec = new Rectangle(0, 0, this.canvas!.clientWidth, this.headerCanvas!.height);
    MDraw.fillRectangle(this.headerCtx!, this.calendarData!.calendarSetting!.controlBackGroundColor, rec);
    MDraw.drawText(
      this.headerCtx!,
      'Name',
      rec.left,
      rec.top,
      rec.width,
      rec.height, this.calendarData!.calendarSetting!.font,
      12,
      this.calendarData!.calendarSetting!.foreGroundColor,
      TextAlignmentEnum.Center,
      BaselineAlignmentEnum.Center);
      MDraw.drawBorder(this.headerCtx!, rec.left, rec.top, rec.width, rec.height,  this.calendarData!.calendarSetting!.controlBackGroundColor, 2, Gradient3DBorderStyleEnum.Raised)

      this.ctx!.drawImage(this.headerCanvas!, 0, 0);
    
  }
  setMetrics(): void{
    const visibleRows: number =
    Math.floor(this.canvas!.clientHeight / this.calendarData!.calendarSetting!.cellHeight) - 1;
  const visibleCols: number =
    Math.floor(this.canvas!.clientWidth / this.calendarData!.calendarSetting!.cellWidth) - 1;
  }
}
