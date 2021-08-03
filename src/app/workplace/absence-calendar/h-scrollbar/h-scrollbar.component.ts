
import {
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MDraw } from 'src/app/helpers/draw-helper';
import { Gradient3DBorderStyleEnum } from 'src/app/helpers/enums/draw.enum';
import { AbsenceBodyComponent } from '../absence-body/absence-body.component';
import { ScrollCalendar } from '../absenceClasses/scroll-calendar';


@Component({
  selector: 'app-cal-h-scrollbar',
  templateUrl: './h-scrollbar.component.html',
  styleUrls: ['./h-scrollbar.component.scss']
})
export class CalHScrollbarComponent implements OnInit, AfterViewInit, OnDestroy {


  public maximumRow: number = 0;

  private ctx: CanvasRenderingContext2D | undefined;
  private canvas!: HTMLCanvasElement | undefined;
  // tslint:disable-next-line:variable-name
  private _scrollValue = 0;
  private thumbLength = 0;
  private tickSize = 0;
  private MouseEnterThumb = false;
  private MousePointThumb = false;
  private MouseXToThumbY = 0;
  private MouseOverThumb = false;
  private imgThumb!: ImageData | undefined;
  private imgSelectedThumb!: ImageData | undefined;
  public isDirty = false;
  private requestID: number | undefined;
  private moveAnimationValue = 0;

  @Input() absenceBody: AbsenceBodyComponent | undefined;
  @Input() ScrollCalendar: ScrollCalendar | undefined;

  constructor(
    private zone: NgZone,
  ) { }

  /* #region ng */

  ngOnInit() {
    this.canvas = document.getElementById('cal-hScrollbar') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  ngAfterViewInit() {
    this.scrollLeft = 0;
    this.refresh();
  }

  ngOnDestroy(): void {
    this.ctx = undefined;
    this.canvas = undefined;
    this.imgThumb = undefined;
    this.imgSelectedThumb = undefined;
    this.ScrollCalendar = undefined;
  }
  /* #endregion ng */

  init() {
    this.scrollLeft = 0;
    this.refresh();
  }

  // tslint:disable-next-line:variable-name
  private set scrollLeft(_value: number) {
    if (this.isDirty) {
      return;
    }

    if (_value === undefined || Number.isNaN(_value)) {
      _value = 0;
    }

    if (this._scrollValue !== _value) {
      this._scrollValue = _value;

      let res: number = Math.ceil(this._scrollValue / this.tickSize);
      if (res === undefined || Number.isNaN(res)) {
        res = 0;
      }

      const diff: number = res - this.ScrollCalendar!.hScrollValue;

      this.isDirty = true;
      this.absenceBody!.moveGrid(diff, 0);
      this.isDirty = false;
    }
  }
  private get scrollLeft(): number {
    let res: number = Math.ceil(this.ScrollCalendar!.hScrollValue * this.tickSize);
    if (res === undefined || Number.isNaN(res)) {
      res = 0;
    }
    return res;
  }

  // tslint:disable-next-line:variable-name
  set value(_value: number) {
    if (_value === undefined || Number.isNaN(_value)) {
      _value = 0;
    }

    let res: number = Math.ceil(_value * this.tickSize);
    if (res === undefined || Number.isNaN(res)) {
      res = 0;
    }

    this._scrollValue = res;

    this.reDraw();
  }
  get value(): number {
    return this.ScrollCalendar!.hScrollValue;
  }

  refresh() {
    this.calcMetrics();
    this.reDraw();
  }

  private reDraw() {
    if (!this.ScrollCalendar) {
      return;
    }
    if (this.thumbLength === Infinity) {
      return;
    }
    if (this.tickSize === Infinity) {
      return;
    }

    if (this.canvas && this.ctx && this.imgSelectedThumb && this.imgThumb) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;

      this.ctx.save();

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if (this.MouseOverThumb) {
        this.ctx.putImageData(this.imgSelectedThumb, this.scrollLeft, 3);
      } else {
        this.ctx.putImageData(this.imgThumb, this.scrollLeft, 3);
      }
      this.ctx.restore();
    }

  }

  private createThumb(): void {
    if (this.thumbLength === -Infinity) {
      return;
    }
    if (this.thumbLength === Infinity) {
      return;
    }

    this.imgThumb = undefined;
    this.imgSelectedThumb = undefined;

    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = this.thumbLength;
    canvas.height = this.canvas!.clientHeight - 6;

    ctx.fillStyle = '#A9A9A9';

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.imgThumb = ctx.getImageData(0, 0, canvas.width, canvas.height);

    MDraw.drawBorder(
      ctx,
      0,
      0,
      canvas.width,
      canvas.height,
      ctx.fillStyle,
      3,
      Gradient3DBorderStyleEnum.Raised
    );

    this.imgSelectedThumb = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  private calcMetrics(): void {
    if (!this.ScrollCalendar) {
      return;
    }
    if (this.canvas) {

      const w: number = this.canvas.clientWidth;
      let moveZoneLength = w / this.ScrollCalendar!.colPercent;

      this.thumbLength = this.canvas.clientWidth - moveZoneLength;

      if (this.thumbLength < 10) {
        this.thumbLength = 10;
        moveZoneLength -= 10;
      }

      this.tickSize = moveZoneLength / this.ScrollCalendar!.maxCols;
      this.createThumb();
    }
  }

  /* #region Events */
  @HostListener('click', ['$event']) onClick(event: MouseEvent): void { }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.MouseEnterThumb = this.isMouseOverThumb(event);
    this.MouseOverThumb = this.MouseEnterThumb;

    if (this.MouseEnterThumb) {
      // this.MouseYToThumbY = event.clientY - this.scrollTop;
    } else {
      if (event.clientX < this.scrollLeft + this.canvas!.offsetLeft) {
        this.moveAnimationValue = -1;
      } else {
        this.moveAnimationValue = 1;
      }
      this.moveAnimation();
    }
  }

  @HostListener('mouseup', ['$event']) onMouseUp(event: MouseEvent): void {
    this.MouseEnterThumb = false;
    this.MouseXToThumbY = 0;
    this.canvas!.onpointermove = null;
    this.stopMoveAnimation();
  }

  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent): void {
    this.MouseOverThumb = this.isMouseOverThumb(event);

    this.refresh();
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(
    event: MouseEvent
  ): void {
    this.MouseOverThumb = false;
    this.stopMoveAnimation();
    this.refresh();
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(
    event: MouseEvent
  ): void {
    if (this.MouseXToThumbY > 0) {
      this.MouseOverThumb = this.isMouseOverThumb(event);
      this.refresh();
    }
  }

  @HostListener('pointerdown', ['$event']) onPointerDown(
    event: PointerEvent
  ): void {
    this.MousePointThumb = this.isMouseOverThumb(event);
    if (this.MousePointThumb && event.buttons === 1) {
      this.MouseXToThumbY = event.clientX - this.scrollLeft;
      this.canvas!.setPointerCapture(event.pointerId);
    }
  }

  @HostListener('pointerup', ['$event']) onPointerUp(
    event: PointerEvent
  ): void {
    this.MousePointThumb = false;
    this.canvas!.releasePointerCapture(event.pointerId);
  }

  @HostListener('pointermove', ['$event']) onPointerMove(
    event: PointerEvent
  ): void {
    if (this.MousePointThumb) {
      const x = event.clientX - this.MouseXToThumbY;
      this.zone.run(() => {
        if (this.MousePointThumb) {
          this.scrollLeft = x;
        }
      });
    }
  }

  /* #endregion Events */

  isMouseOverThumb(event: MouseEvent): boolean {
    const x: number = event.clientX - this.canvas!.offsetLeft;

    if (x >= this.scrollLeft && x <= this.scrollLeft + this.thumbLength) {
      return true;
    }

    return false;
  }

  moveAnimation() {
    if (this.moveAnimationValue < 0) {
      this.absenceBody!.moveGrid(-5, 0);
    } else if (this.moveAnimationValue > 0) {
      this.absenceBody!.moveGrid(5, 0);
    } else {
      this.stopMoveAnimation();
    }

    this.requestID = window.requestAnimationFrame(x => {
      this.moveAnimation();
    });
  }
  stopMoveAnimation(): void {
    this.moveAnimationValue = 0;
    window.cancelAnimationFrame(this.requestID!);
  }

}
