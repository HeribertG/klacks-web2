import { Rectangle } from "../helpers/geometry";
import { IStaff } from "./employee-class";

export class CalendarHeaderDayRank {
    backColor:string ='';
    name:string ='';
    rect: Rectangle= new Rectangle(0,0,20,20)
}

export interface IAbsence {
    employeeId: | string | null;
    absenceReasonId: | string | null;
    BeginDate: Date | string ;
    EndDate: Date | string ;
}

export interface ICalendar  {


    id: | string | null;
    idNumber: number | string | null;
    company: string;
    title: string | null;
    name: string;
    firstName: string;
    secondName: string;
    staff: IStaff ;
    gender: | string | null;
    legalEntity: boolean;
    type: number | string;
    absences: Array<IAbsence>;
  }