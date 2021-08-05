

export interface IHolydayRule {
  id: string;
  name: string;
  rule: string;
  subRule: string;
  description: string;
  visible: boolean;
  paid: boolean

}
export class HolydayRule implements IHolydayRule {
  id = '';
  name = '';
  rule = '';
  subRule = '';
  description = '';
  visible =false;
  paid =false;

}
