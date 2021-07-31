using klacks_web_api.Models.Setting;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace klacks_web_api.Interface
{
  public interface ISettingsRepository
  {
    List<Settings> GetSettingsList();
    Settings GetSetting(string type);
    Settings PutSetting(Settings settings);
    Settings AddSetting(Settings settings);
    Task<Settings> DeleteSetting(Guid id);
    bool SettingExists(Guid id);
  }
}
