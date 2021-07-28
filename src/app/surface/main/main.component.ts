import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  Injector,
  OnChanges,
} from '@angular/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges {
  @ViewChild('LazyLoadingPlaceholder', { read: ViewContainerRef, static: true })

  viewContainer: ViewContainerRef | undefined;

 
  @Input() isAllAddsresses: boolean = false;
  

  @Input() isEditAddress: boolean= false;
  
  @Output() isChangingEvent = new EventEmitter<boolean>();
  @Output() isEnterEvent = new EventEmitter();



  constructor(
    private injector: Injector,
    private cfr: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes:any) {

  }
    
  onIsChanging(value:boolean) {
    this.isChangingEvent.emit(value);
  }

  onIsEnter() {
    this.isEnterEvent.emit();
  }
}
