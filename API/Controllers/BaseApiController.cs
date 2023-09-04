using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /*
    ApiController attribute has ability to automatically bind our parameters inside our method e.g. reads json object which method will receive.
    ApiController can read attribute properties from DTO models and based on them, inform user e.g. when object has empty value if value is required
    */
    [ServiceFilter(typeof(LogUserActivity))]
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {

    }
}