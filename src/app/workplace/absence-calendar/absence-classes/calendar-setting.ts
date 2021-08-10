
import { EventEmitter, Injectable, Output } from "@angular/core";
import { DataManagementHolydayService } from "src/app/data/management/data-management-holyday.service";
import { MDraw } from "src/app/helpers/draw-helper";
import { ClipboardModeEnum } from "src/app/helpers/enums/grid-settings.enum";
import { HolidaysList } from "src/app/template/classes/holyday-list";


@Injectable({
  providedIn: 'any'
})
export class CalendarSetting {
  @Output() zoomChangingEvent = new EventEmitter();
  @Output() holidayListIsreadEvent = new EventEmitter();
  constructor(private dataManagementHolydayService: DataManagementHolydayService) {
  }

  isEditabled = true;
  holidaysList: HolidaysList | undefined;


  private _zoom = 1;
  private _cellHeight = 30;
  private _headerHeight = 45;
  private _cellWidth = 5;
  private _mainTextHeight = 23;
  private _currentYear = new Date().getFullYear();
  mainFontSize = 12;

  cellPadding = 3;

  evenMonthColor = '#FFFFFF';
  oddMonthColor = '#F7F8E0';
  saturdayColor = '#A9F5BC';
  sundayColor = '#F4FA58';
  holydayColor = '#FFFF00';

  increaseBorder = (0.5);
  cellHeight = this._cellHeight
  cellWidth = this._cellWidth * this.zoom;
  mainTextHeight = this._mainTextHeight
  cellHeaderHeight = this._headerHeight
  font = 'normal ' + this.mainFontSize + 'px Arial';




  backGroundColor = '#FFFFFF';
  borderColor = '#999999';
  mainFontColor = '#000000';
  subFontColor = '#404040';

  foreGroundColor = '#000000';
  controlBackGroundColor: string = '#F4F6F6';
  // headerBackGroundColor = '#f2f2f2';
  headerBackGroundColor = '#FFFFFF';
  headerForeGroundColor = '#4d4d4d';

  focusBorderColor = '#1e90ff';
  focusBorderColorDisabled = '#CCD1D1';

  clipboardMode: ClipboardModeEnum = ClipboardModeEnum.All;
  // tslint:disable-next-line:variable-name
  private _lastPixelRatio = 1;

  get currentYear(): number {
    return this._currentYear;
  }
  set currentYear(value: number) {
    this._currentYear = value;
    this.readList();

  }

  
  private async readList() {
      this.dataManagementHolydayService.createHolydayList(this.currentYear).then((x)=>{
      this.holidaysList =x;
      this.holidayListIsreadEvent.emit();
    });


  }

  /* #region zoom affected sizes */

  get zoom(): number {
    return this._zoom;
  }
  set zoom(value: number) {
    this._zoom = value;
    this.reset();
    this.zoomChangingEvent.emit();
  }

  get htmlZoom(): number {
    return this._zoom * MDraw.pixelRatio();
  }



  reset() {
    this.cellWidth = Math.round(this._cellWidth * this.zoom);

  }


  public get lastPixelRatio(): number {
    return this._lastPixelRatio;
  }
  public set lastPixelRatio(value: number) {

    if (this._lastPixelRatio !== value) {
      this._lastPixelRatio = value;
      this.reset();
    }


  }

  /* #endregion zoom affected sizes */

}
