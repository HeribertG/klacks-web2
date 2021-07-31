import { CreateEntriesEnum } from '../helpers/enums/client-enum';
import { BaseEntity, IStandartType, StandartType } from './general-class';


export interface ISetting {
  id: string | null;
  type: string;
  value: string;
}

export class Setting implements ISetting {
  id = null;
  type = '';
  value = '';
}

export class AppSetting {
  public static APP_NAME = 'APP_NAME';
  public static APP_ADDRESS_NAME = 'APP_ADDRESS_NAME';
  public static APP_ADDRESS_SUPPLEMENT = 'APP_ADDRESS_SUPPLEMENT';
  public static APP_ADDRESS_ADDRESS = 'APP_ADDRESS_ADDRESS';
  public static APP_ADDRESS_ZIP = 'APP_ADDRESS_ZIP';
  public static APP_ADDRESS_PLACE = 'APP_ADDRESS_PLACE';
  public static APP_ADDRESS_PHONE = 'APP_ADDRESS_PHONE';
  public static APP_ADDRESS_MAIL = 'APP_ADDRESS_MAIL';
  public static APP_ACCOUNTING_START = 'APP_ACCOUNTING_START';
 
}


