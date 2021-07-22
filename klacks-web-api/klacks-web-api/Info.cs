using Microsoft.OpenApi.Models;

namespace klacks_web_api
{
    internal class Info : OpenApiInfo
    {
        public new string Title { get; set; }
        public new string Version { get; set; }

    }
}
