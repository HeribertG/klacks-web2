using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using klacks_web_api.Interface;
using klacks_web_api.Models.Setting;

namespace klacks_web_api.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class SettingsController : ControllerBase
  {
    private readonly IMapper mapper;
    private readonly ISettingsRepository repository;
    private readonly IUnitOfWork unitOfWork;

    public SettingsController(IMapper mapper,
                               ISettingsRepository repository,
                               IUnitOfWork unitOfWork)
    {
      this.repository = repository;
      this.mapper = mapper;
      this.unitOfWork = unitOfWork;
    }


    [HttpGet("GetSettingsList")]
    public ActionResult<IEnumerable<Settings>> GetSettingsList()
    {
      return repository.GetSettingsList();

    }

    [HttpGet("GetSetting/{type}")]
    public ActionResult<Settings> GetSetting(string type)
    {
      return repository.GetSetting(type);

    }

    [HttpPut("PutSetting")]
    public async Task<ActionResult> PutSetting(Settings setting)
    {
      var res = repository.PutSetting(setting);
      await unitOfWork.CompleteAsync();
      return Ok(res);

    }

    [HttpPost("AddSetting")]
    public async Task<ActionResult> AddSetting(Settings setting)
    {
      var res = repository.AddSetting(setting);
      await unitOfWork.CompleteAsync();
      return Ok(res);

    }



  }
}
