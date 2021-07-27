using System;
using System.Net.Mail;

namespace klacks_web_api.Helper
{
  public class EmailWrapper
  {

    public string EMailAddress { get; set; } = "NoReply@gutknecht-informatik.com";
    public string EMailMessage { get; set; } = "Ihre Rechnung";
    public string Subject { get; set; } = "Ihre Rechnung";
    public string Mark { get; set; } = "SVA ";
    public bool? MailPriority { get; set; } = null;
    public string ReplyTo { get; set; } = string.Empty;
    public string Outgoingserver { get; set; } = "smtp.madlan.ch";
    public string OutgoingserverPort { get; set; } = "25";
    public string OutgoingserverUsername { get; set; } = string.Empty;
    public string OutgoingserverPassword { get; set; } = string.Empty;
    public bool EnabledSsl { get; set; } = false;
    public string AuthenticationType { get; set; } = "";
    public bool ReadReceipt { get; set; } = false;
    public bool DispositionNotification { get; set; } = false;
    public int OutgoingserverTimeout { get; set; } = 1000;



    /// <summary>
    /// Send a eMail
    /// </summary>
    /// <param name="strTo">To whom: = email addresses separated by a semicolon</param>
    /// <param name="strSubject">Subject line</param>
    /// <param name="strMessage">Your message</param>
    /// <param name="fileList">The path of attached files</param>
   /// <returns></returns>
    /// <remarks></remarks>
    public bool SendEmailMessage(string strTo, string strSubject, string strMessage, string[] fileList)
    {

     
      string address = EMailAddress;
      MailMessage mailMsg = SetAddress(strTo, address);

      SetBody(strSubject, strMessage, mailMsg);

      long lenght = 0;
      var count = 0;
      // attach each file attachment
      foreach (var strfile in fileList)
      {
        count++;
        if (!string.IsNullOrEmpty(strfile))
        {
          try
          {
            var msgAttach = new Attachment(strfile);
            lenght += msgAttach.ContentStream.Length;

            mailMsg.Attachments.Add(msgAttach);

          }
          catch (Exception)
          {
            return false;
          }

        }

      }

      SendEmail(mailMsg);
      return true;

    }



    /// <summary>
    /// Send a eMail
    /// </summary>
    /// <param name="strTo">To whom: = email addresses separated by a semicolon</param>
    /// <param name="strSubject">Subject line</param>
    /// <param name="strMessage">Your message</param>
    /// <param name="file">The path of attached file</param>
    /// <returns></returns>
    /// <remarks></remarks>
    public bool SendEmailMessage(string strTo, string strSubject, string strMessage, string file)
    {

      string address = EMailAddress;
      MailMessage mailMsg = SetAddress(strTo, address);
      SetBody(strSubject, strMessage, mailMsg);



      if (!string.IsNullOrEmpty(file))
      {
        var msgAttach = new Attachment(file);
        mailMsg.Attachments.Add(msgAttach);
      }

      return SendEmail(mailMsg);

    }


    private MailMessage SetAddress(string strTo, string address)
    {
      MailMessage mailMsg;

      if (Mark == string.Empty)
      {
        mailMsg = new MailMessage() { From = new MailAddress(address.Trim()) };
      }
      else
      {
        mailMsg = new MailMessage() { From = new MailAddress(Mark + "<" + address.Trim() + ">") };

      }

      var tmpTo = strTo.Split(";");

      foreach (var tmp in tmpTo)
      {
        if (tmp != string.Empty)
        {
          mailMsg.To.Add(new MailAddress(tmp.Trim()));
        }
      }

      return mailMsg;
    }
    private void SetBody(string strSubject, string strMessage, MailMessage mailMsg)
    {
      if (string.IsNullOrEmpty(strSubject))
      {
        strSubject = "";

      }
      if (string.IsNullOrEmpty(strMessage))
      {
        strMessage = "";

      }

      mailMsg.Subject = strSubject.Trim();
      mailMsg.Body = strMessage.Trim() + Environment.NewLine;
      mailMsg.IsBodyHtml = true;

    }

    private bool SendEmail(MailMessage mailMsg)
    {
      SmtpClient smtpMail;
      if (!string.IsNullOrEmpty(OutgoingserverPort))
      {
        smtpMail = new SmtpClient(Outgoingserver, int.Parse(OutgoingserverPort));
      }
      else
      {
        smtpMail = new SmtpClient(Outgoingserver);
      }

      var switchExpr = AuthenticationType;
      switch (switchExpr)
      {
        case "<None>":
          {
            smtpMail.UseDefaultCredentials = true;
            break;
          }
        case "":
          {
            smtpMail.UseDefaultCredentials = true;
            break;
          }

        default:
          {
            var basicAuthenticationInfo = new System.Net.NetworkCredential(OutgoingserverUsername, OutgoingserverPassword);
            smtpMail.Credentials = basicAuthenticationInfo.GetCredential(smtpMail.Host, smtpMail.Port, AuthenticationType);

            break;
          }
      }
      try
      {

        smtpMail.EnableSsl = EnabledSsl;
        smtpMail.DeliveryMethod = SmtpDeliveryMethod.Network;
        smtpMail.Send(mailMsg);


      }
      catch (Exception)
      {
        return false;
      }

      return true;
    }
  }
}
