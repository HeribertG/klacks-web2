import { Rectangle } from "../helpers/geometry";
import { IStaff } from "./employee-class";

export class CalendarHeaderDayRank {
    backColor: string = '';
    name: string = '';
    rect: Rectangle = new Rectangle(0, 0, 20, 20)

}

export interface IAbsence {
    employeeId: | string | null;
    absenceReasonId: | string | null;
    BeginDate: Date | string;
    EndDate: Date | string;
}

export interface ICalendar {


    id: | string | undefined;
    idNumber: number | string | null;
    company: string;
    title: string | null;
    name: string;
    firstName: string;
    secondName: string;
    staff: IStaff;
    gender: | string | null;
    legalEntity: boolean;
    type: number | string;
    absences: Array<IAbsence>;
}

export interface IAbsenceReason {
    id: | string | undefined;
    name: string;
    description: string;
    backgroundColor: string;
    defaultlenght: number;
    defaultValue: number;
    withSaturday: boolean;
    withSunday: boolean;
    withHoliday: boolean;
    isWork: boolean;
}

export class AbsenceReason implements IAbsenceReason {
    id = undefined;
    name = '';
    description = '';
    backgroundColor = '';
    defaultlenght = 0;
    defaultValue = 0;
    withSaturday = false;
    withSunday = false;
    withHoliday = false;
    isWork = false;
}

