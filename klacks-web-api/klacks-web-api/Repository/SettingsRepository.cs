
using klacks_web_api.Data;
using klacks_web_api.Interface;
using klacks_web_api.Models.Setting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace SVA.API.Repository
{
  public class SettingsRepository : ISettingsRepository
  {
    private readonly DatabaseContext context;
    public SettingsRepository(DatabaseContext context)
    {
      this.context = context;
    }
    public List<Settings> GetSettingsList()
    {
      return context.Settings.ToList();
    }

        public Settings GetSetting(string type)
    {
      return context.Settings.FirstOrDefault(x => x.Type == type);
    }

    public Settings PutSetting(Settings setting)
    {
      context.Settings.Update(setting);
      return setting;


    }

    public Settings AddSetting(Settings settings)
    {
      context.Settings.Add(settings);
      return settings;

    }



    public async Task<Settings> DeleteSetting(Guid id)
    {
      var settings = await context.Settings.FindAsync(id);

      context.Settings.Remove(settings);

      return settings;
    }

    public bool SettingExists(Guid id)
    {
      return context.Settings.Any(e => e.Id == id);
    }



  }
}
