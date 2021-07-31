using System.Linq;
using klacks_web_api.Data;

namespace klacks_web_api.Helper
{
  public class MsgEMail
  {
    private readonly DatabaseContext context;

    public MsgEMail(DatabaseContext context)
    {
      this.context = context;
    }



    private EmailWrapper InitEMailWrapper()
    {
     //  var setting = context.Settings.ToList();

      var email = new EmailWrapper();
      try
      {

        //email.EMailAddress = setting.FirstOrDefault(x => x.Type == "eMailAddress")?.Value;
        //email.Subject = setting.FirstOrDefault(x => x.Type == "subject")?.Value;
        //email.Mark = setting.FirstOrDefault(x => x.Type == "mark")?.Value;
        //email.MailPriority = string.IsNullOrEmpty(setting.FirstOrDefault(x => x.Type == "mailPriority")?.Value) ? null : (bool?)bool.Parse(setting.FirstOrDefault(x => x.Type == "mailPriority")?.Value!);
        //email.ReplyTo = setting.FirstOrDefault(x => x.Type == "replyTo")?.Value;
        //email.Outgoingserver = setting.FirstOrDefault(x => x.Type == "outgoingserver")?.Value;
        //email.OutgoingserverPort = setting.FirstOrDefault(x => x.Type == "outgoingserverPort")?.Value;
        //email.OutgoingserverUsername = setting.FirstOrDefault(x => x.Type == "outgoingserverUsername")?.Value;
        //email.OutgoingserverPassword = setting.FirstOrDefault(x => x.Type == "outgoingserverPassword")?.Value;
        //email.EnabledSsl = bool.Parse(setting.FirstOrDefault(x => x.Type == "enabledSSL")?.Value!);
        //email.AuthenticationType = setting.FirstOrDefault(x => x.Type == "authenticationType")?.Value;
        //email.ReadReceipt = bool.Parse(setting.FirstOrDefault(x => x.Type == "readReceipt")?.Value!);
        //email.DispositionNotification = bool.Parse(setting.FirstOrDefault(x => x.Type == "dispositionNotification")?.Value!);
        //email.OutgoingserverTimeout = int.Parse(setting.FirstOrDefault(x => x.Type == "outgoingserverTimeout")?.Value!);

        return email;
      }
      catch
      {
        // ignored
      }

      return null;
    }

    public bool SendMail(string currenteMail, string subject, string msg)
    {
      var email = InitEMailWrapper();
      if (email!= null) { return email.SendEmailMessage(currenteMail, subject, msg, ""); }

      return false;
    }


  }
}
