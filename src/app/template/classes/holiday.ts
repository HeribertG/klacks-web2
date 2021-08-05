export class Holiday {

  private _holidayName: string = '';
  private _rule: string = '';
  private _subRule: string = '';
  private _description: string = '';
  private _officialHoliday: boolean = false;
  private _id: string = '';


  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
  }

  get officialHoliday(): boolean {
    return this._officialHoliday;
  }
  set officialHoliday(value: boolean) {
    this._officialHoliday = value;
  }

  public get name(): string {
    return this._holidayName;
  }
  public set name(value: string) {
    this._holidayName = value;
  }

  get rule(): string {
    return this._rule;
  }
  set rule(value: string) {
    this._rule = value;
  }

  get subRule(): string {
    return this._subRule;
  }
  set subRule(value: string) {
    this._subRule = value;
  }
  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }
}
