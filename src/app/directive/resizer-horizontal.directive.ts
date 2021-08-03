import { Directive, HostListener, ElementRef, Input, OnInit, AfterViewInit, OnDestroy, EventEmitter, Output, Renderer2 } from '@angular/core';
import { MObject } from '../helpers/object-helpers';


@Directive({
  selector: '[appResizerHorizontale]'
})
export class ResizerHorizontalDirective implements OnInit, AfterViewInit, OnDestroy {


  private diff = 0;

  oldY = 0;
  grabber = false;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }

  @Input() topElement: HTMLElement | undefined;
  @Input() parentElement: HTMLElement | undefined;
  @Input() bottomElement: HTMLElement | undefined;

  @Input() minTop: number | undefined = undefined;
  @Input() minBottom: number | undefined = undefined;
  @Input() firstTop: number | undefined = undefined;
  @Output() rightChange = new EventEmitter<number>();

  bottom: number = 0;
  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
  }

  ngAfterViewInit(): void {
    if(this.firstTop!){
      this.firstResizerHorizontal(this.firstTop!);
    } else {
      this.resizerHorizontal(0);
    }
    
  }

  ngOnDestroy(): void { }



  @HostListener('document:mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])


  onMouseMove(event:any) {
    if (!this.grabber) {
      return;
    }


    event.preventDefault();

    let clientY = 0;
    if (event.touches) {
      clientY = event.touches[0].clientY;
    } else {

      clientY = event.clientY;
    }

    this.resizerHorizontal(clientY - this.oldY);
    this.oldY = clientY;

    this.renderer.setStyle(document.body, 'cursor', 'n-resize');

  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;

    this.renderer.setStyle(document.body, 'cursor', 'default');

    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
  }

  resizerHorizontal(offsetX: number) {

    this.bottom += offsetX;

    const topRect = MObject.getElementPixelSize(this.topElement!);
    const parentRect = MObject.getElementPixelSize(this.parentElement!);
    const boderRect = MObject.getElementPixelSize(this.el.nativeElement);

    let tmpTopHeight = this.bottom - topRect.top;

    if (this.minTop) {
      if (tmpTopHeight < this.minTop) { tmpTopHeight = this.minTop ;}
    }

    this.resize(tmpTopHeight,parentRect,topRect,boderRect);

  }


  firstResizerHorizontal(offsetX: number) {
    const topRect = MObject.getElementPixelSize(this.topElement!);
    const parentRect = MObject.getElementPixelSize(this.parentElement!);
    const boderRect = MObject.getElementPixelSize(this.el.nativeElement);

    this.bottom = offsetX+topRect.top;
    let tmpTopHeight = this.bottom - topRect.top;

    if (this.minTop) {
      if (tmpTopHeight < this.minTop) { tmpTopHeight = this.minTop ;}
    }

    this.resize(tmpTopHeight,parentRect,topRect,boderRect);

  }

  private resize(tmpTopHeight: number, parentRect: DOMRect,topRect: DOMRect,boderRect: DOMRect){
    const tmpHeight = parentRect.height - boderRect.height;
    let tmpBottomHeight = tmpHeight - tmpTopHeight;
    if (this.minBottom) {
      if (tmpBottomHeight < this.minBottom) {
        const diff = this.minBottom - tmpBottomHeight;
        tmpBottomHeight = this.minBottom;
        tmpTopHeight -= diff;
        this.bottom -= diff;

      }
    }

    this.renderer.setStyle(this.topElement, 'height', tmpTopHeight + 'px');
    this.renderer.setStyle(this.el.nativeElement, 'top', this.bottom + 'px');

    this.renderer.setStyle(this.bottomElement, 'height', tmpBottomHeight + 'px');

    if (this.grabber) { this.onDataChange(); }
  }

  @HostListener('document:mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMouseDown(event: any) {



    event.preventDefault();

    const targetElement = event.target as HTMLElement;
    if (targetElement === this.el.nativeElement as HTMLElement) {

      this.setRight(event.clientX);

      this.grabber = true;

      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'grey');

      if (event.touches) {
        // console.log(event.touches[0]);
        this.oldY = event.touches[0].clientX;
      } else {

        this.oldY = event.clientX;
      }

      //  console.log('onMouseDown', this.diff, this.bottom, this.oldY);
    }
  }

  private setRight(deltaX: number) {
    const r: ClientRect = this.el.nativeElement.getBoundingClientRect();
    this.diff = deltaX - r.left;
    this.bottom = r.left + this.diff;
  }

  onDataChange() {
    this.rightChange.emit(this.bottom);
  }

}
