import { Injectable } from '@angular/core';
import { HolidayDate, HolidaysList } from 'src/app/template/classes/holyday-list';
import { Moment } from 'moment';
import { DataHolydayRulesService } from '../data-holyday-rules.service';
import { Holiday } from 'src/app/template/classes/holiday';
import { IHolydayRule } from 'src/app/core/holyday-rule';

@Injectable({
  providedIn: 'root'
})
export class DataManagementHolydayService {


  constructor(private dataHolydayRulesService: DataHolydayRulesService) { }

  async createHolydayList(currenYaer: number): Promise<HolidaysList | undefined> {

    return await this.dataHolydayRulesService.readHolydayRuleList().toPromise().then((value: IHolydayRule[]) => {
      const holidayList = new HolidaysList();
      
      value.forEach(holidayRule => {

        const h = new Holiday();
        h.id = holidayRule.id;
        h.rule = holidayRule.rule;
        h.subRule = holidayRule.subRule;
        h.officialHoliday = holidayRule.paid;
        h.description = holidayRule.description;

        holidayList.add(h);

        holidayList.CurrentYear = currenYaer;
        holidayList.computeHolidays();
        

      });
      return holidayList;
    });
  }
}
