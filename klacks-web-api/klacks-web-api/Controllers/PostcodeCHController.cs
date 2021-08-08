using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using klacks_web_api.Data;
using klacks_web_api.Models.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace klacks_web_api.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class PostcodeChController : ControllerBase
  {
        private readonly DatabaseContext context;

        public PostcodeChController(DatabaseContext context)
        {
            this.context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostcodeCH>>> GetPostcodeCh()
        {
            return await context.PostcodeCH.ToListAsync();
        }


        [HttpGet("{zip}")]
        public async Task<ActionResult<IEnumerable<PostcodeCH>>> GetPostcodeCh(int zip)
        {
            var postcodeCh = await context.PostcodeCH.Where(x => x.Zip == zip).ToListAsync();

            if (postcodeCh == null)
            {
                return NotFound();
            }

            return postcodeCh;
        }

    }
        
}
