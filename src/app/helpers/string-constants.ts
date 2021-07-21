

export class MessageLibrary {
  public static readonly UPDATE_NOT_DONE = 'Änderungen wurden von der Datenbank nicht übernommen';
  public static readonly CANCEL_NOT_DONE = 'Änderungen können nicht rückgängig gemacht werden';
  public static readonly ADDRESS_NOT_VALID = 'Anschrift ist nicht vollständig';
  public static readonly ENTRIES_NOT_VALID = 'Eingaben sind nicht vollständig';
  public static readonly SUBSCRIPTION_NOT_VALID = 'Eingaben sind nicht vollständig oder Betrag ist negativ';
  public static readonly PROFESSION_NOT_VALID = 'Es ist kein Diplom ausgewählt';
  public static readonly ZIP_NOT_VALID = 'Bitte überprüfen sie die Postleitzahl auf ihre Gültigkeit';
  public static readonly DISABLE_POPUP_BLOCKER = 'Bitte deaktivieren Sie Ihren Pop-Up-Blocker und versuchen Sie es noch einmal.';
  public static readonly PLEASE_BE_PATIENT_EXCEL =
    `Die Excel Datei braucht ein wenig Zeit für seine Erstellung.
  Bitte haben sie einen Moment Geduld.`;
  public static readonly TOKEN = 'JWT_TOKEN';
  public static readonly TOKEN_EXP = 'JWT_TOKEN_EXP';
  public static readonly TOKEN_SUBJECT = 'JWT_TOKEN_SUBJECT';
  public static readonly TOKEN_USERNAME = 'JWT_TOKEN_USERNAME';
  public static readonly TOKEN_USERID = 'JWT_TOKEN_USERID';
  public static readonly TOKEN_ADMIN = 'JWT_TOKEN_ADMIN';
  public static readonly TOKEN_AUTHORISED = 'JWT_AUTHORISED';
  public static readonly TOKEN_REFRESHTOKEN = 'JWT_REFRESH';
  public static readonly TOKEN_APPVERSION = 'JWT_APP_VERSION';
  public static readonly SERVER_NOT_VALID = 'Es konnte keine Verbindung mit dem Server hergestellt werden';
  public static readonly UNKNOW_ERROR = 'Unbekannter Fehler';
  public static readonly HTTP204 = 'Fehler 204 Die Ressource konnte nicht gefunden werden';
  public static readonly HTTP400 = 'Fehler 400 Ungültige Anforderung';
  public static readonly HTTP401 = 'Fehler 401 Nicht autorisierter Zugriff. Möglicherweise ist ihre Zugangsberechtigung abgelaufen!';
  public static readonly HTTP403 = 'Fehler 403 Die Anfrage wird mangels Berechtigung nicht durchgeführt';
  public static readonly HTTP404 = 'Fehler 404 Die angeforderte Ressource wurde nicht gefunden';
  public static readonly PLEASE_BE_PATIENT_INVOICE =
    `Das speichern aller Rechnungen braucht ein wenig Zeit.
  Bitte haben sie einen Moment Geduld.`;
  public static readonly EXPIRED_TOKEN = 'Ihre Zugangsberechtigung ist abgelaufen!';
  public static readonly ROUTER_TOKEN = 'ROUTER_TOKEN_CLIENT_DATA';
  public static readonly ROUTER_SUBTOKEN = 'ROUTER_TOKEN_SUB_DATA';


  public static readonly AUTH_USER_NOT_EXIST =
    'Es wurde ein falsches Passwort oder falscher Benutzername eingegeben. Bitte versuchen Sie es erneut!';
  public static readonly ERROR_CREATING_INVOICE =
    'Rechnungsausdrucke als PDF erstellen nicht möglich! Bitte wenden Sie sich an Ihren Administrator.';


  public static readonly PLEASE_BE_PATIENT_PDF =
    `Das Kreieren von PDF für die Rechnungen braucht viel Zeit und wird
    dewegen im Hintergrund erledigt. Sie werden informiert, wenn dieser Prozess abgeschlossen ist.`;
  public static readonly AUTH_USER_ERROR =
    'Zugangsberechtigung fehlgeschlagen! ';
  public static readonly RESPONSE_ERROR =
    'Bekommen keine Antwort vom Server! ';

  public static readonly NONE =    '<nicht definiert>';
  public static readonly NO =    '<kein>';
  public static readonly ALL =    '<Alle>';

  public static readonly SUCCESS_STORAGE =
    'Daten wurden erfolgreich gespeichert';

  public static readonly NEW_ENTRY = 'neuer Eintrag';
  public static readonly NOT_DEFINED = 'nicht definiert';
  public static readonly NOT_REGISTER_UPERCASECHARACTER = 'Passwörter müssen mindestens ein Zeichen in Großbuchstaben enthalten.';
  public static readonly NOT_REGISTER_DIGIT = 'Passwörter müssen mindestens eine Zahl haben.';
  public static readonly NOT_REGISTER_ALPHANUMERICCHARACTER = 'Passwörter müssen mindestens ein nicht alphabetisches Zeichen enthalten.';
  public static readonly NOT_REGISTER = 'Konnte Account nicht speichern';
  public static readonly REGISTER = 'Die Account Daten wurden in der Zwischenablage gespeichert';
  public static readonly REGISTER_CHANGE_PASSWORD = 'Die Account Daten wurden in der Zwischenablage gespeichert';
  public static readonly REGISTER_SEND_PASSWORD = 'Das Passwort wurde erfolgreich zurückgesetzt und an die Mailadresse versendet';
  public static readonly REGISTER_SEND_PASSWORD_ERROR = 'Error';
  public static readonly REGISTER_CHANGE_PASSWORD_HEADER = 'Die Account Daten wurden in der Zwischenablage gespeichert';

  public static readonly DELETE_ENTRY = 'Wollen Sie diesen Datensatz wirklich löschen?';
  public static readonly DELETE_EXPORT = 'Wollen Sie diesen Export wirklich löschen?';
  public static readonly DEACTIVE_ADDRESS = 'Wollen Sie diese Adresse deaktivieren?';
  public static readonly REACTIVE_ADDRESS = 'Wollen Sie diese Adresse reaktivieren?';
  public static readonly DEACTIVE_ADDRESS_TITLE = 'Deaktivieren';
  public static readonly DELETE_ZERIFICATE = 'Wollen Sie dieses Diplom wirklich löschen?';
  public static readonly REACTIVE_ADDRESS_TITLE = 'Reaktivieren';

  public static readonly PASSWORD_STRENGTH_SHORT = 'zu kurz';
  public static readonly PASSWORD_STRENGTH_WEAK = 'zu schwach';
  public static readonly PASSWORD_STRENGTH_COMMON = 'zu unsicher';
  public static readonly PASSWORD_STRENGTH_STRONG = 'sicher';


  public static readonly ADDRES_TYPE0_NAME = 'Hauptadresse';
  public static readonly ADDRES_TYPE1_NAME = 'Geschäftsadresse';
  public static readonly ADDRES_TYPE2_NAME = 'Rechnungsadresse';
  public static readonly ADDRES_TYPE_UNDEFINED = 'Undefiniert';

  public static readonly ENTITY_TYPE_ALL = 'Alle Kategorien';

  public static readonly INVOICE_NAME_NOT_VALID = 'Rechnung hat keinen Namen';
  public static readonly INVOICE_ROW_NAME_NOT_VALID = 'RechnungDetail hat keinen Namen';

  public static readonly INVOICE__NOT_STORED = 'Rechnung wurde nicht oder nur unvollständig gespeichert';

  public static readonly DIPLOMA_NOT_STORED = 'Ein Diplom muss zuerst gespeichert sein, bevor ein PDF diesem zugewiesen werden kann.';

  public static readonly BESR_ERROR = 'Fehler bei Einlesen der Besr Datei ! ';
  public static readonly BESR_ERROR_WRONG_FILE = 'Falsche Datei! ';
  public static readonly BESR_ERROR_400 = 'Datei wurde schon einmal eingelesen!';
  public static readonly BESR_ERROR_404 = 'Die Datei konnte nicht gefunden werden oder sie ist leer. ';
  public static readonly PLEASE_BE_PATIENT_BESR_READ =
    `Das Lesen der braucht ein wenig Zeit.
  Bitte haben sie einen Moment Geduld.`;

  public static readonly WORKSHOP_DOUBLETTE = 'Die ausgewählte Person ist in der Liste schon vorhanden';


  public static readonly SIGNALR_RECEIVE_MESSAGE = 'ReceiveMessage';
  public static readonly SIGNALR_RECEIVE_ERROR = 'ReceiveError';
  public static readonly SIGNALR_START_TRANSMISSION = 'Start transmission';
  public static readonly SIGNALR_END_TRANSMISSION = 'End transmission';
  public static readonly SIGNALR_RECEIVE_PROGRESS = 'ReceiveProgress';
  public static readonly PLEASE_BE_PATIENT_SIGNALR =
    `Die PDF Dateien brauchen viel Zeit für ihre Erstellung.
     Bitte haben sie einen Moment Geduld.

  ... ------------------------------------------------------
  Die Dateien werden im Hindergrund generiert. Sie können ohnen Sorgen weiterabeiten oder den Computer ausschalten.`
  ;

  public static readonly PLEASE_BE_PATIENT_DOWNLOAD_BIG_FILE =
    `Bei grosse Dateien kann der Download einige Zeit beanspruchen.
     Bitte haben sie einen Moment Geduld.
  `
  ;

  public static readonly SIGNALR_CONNECTIONID = 'SIGNALR_CONNECTIONID';
  public static readonly INVOICE_WAS_SEND_BY_EMAIL = 'Rechnung wurde per Email gesendet';
  public static readonly CLIENTLIST_ERROR_500 = 'Internal Server Error. Beim Lesen der Mitgliederliste ist ein Fehler aufgetaucht. Bitte versuchen sie es erneut ';

  public static readonly STORE_IT = 'Bitte speichern sie zuerst ab';
  public static readonly PARTICIPANT = 'Teilnehmer';
  public static readonly COST = 'Kosten';

  public static readonly DELETE_OPTION = 'Sind Sie sicher, dass sie diese Option löschen wollen? Die Kurse die mit dieser Option, werden nicht mehr sichtbar sein!';
  public static readonly WORKSHOP_CATEGPRY_NOT_SET = 'Boitte wählen sie eine Kategorie aus!';

  public static readonly ERROR_LOADIMAGE_HTTP500 = 'Bild konnte auf dem Server nicht gefunden werden';

  
}



