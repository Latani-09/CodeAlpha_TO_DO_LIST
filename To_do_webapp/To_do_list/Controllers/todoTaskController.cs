using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using To_do_list.Data;
using To_do_list.DTOS;
using To_do_list.Models;

namespace To_do_list.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class TodoTaskController : Controller
    {
        private ApplicationDbContext _datacontext;
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
         };

        private readonly ILogger<TodoTaskController> _logger;

        public TodoTaskController(ILogger<TodoTaskController> logger,ApplicationDbContext datacontext)
        {
            _datacontext = datacontext;
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
        [HttpGet("gettasks")]
        public async Task<ActionResult<List<Task_to_do>>> GetTasks()
        {
            var tasks =  _datacontext.Tasks.ToList();
            return tasks;
        }

        [HttpPost("addtask")]
        public async Task<ActionResult> AddTask([FromBody] TaskDTO task)
        {
            var task_to_add = new Task_to_do()
            {
                TaskID=new Guid(),
                Title = task.Title,
                createdAt = DateTime.Now,
                Description = task.Description,
                status=task.status,
                priority= (Task_to_do.Priority?)task.GetPriorityEnum(),
                Due=task.DeserializeDate(),
                type=task.type,

            };

            await _datacontext.Tasks.AddAsync(task_to_add);
            await _datacontext.SaveChangesAsync();
            
            Console.WriteLine("adding task ---------'",task_to_add);

            return Ok(task_to_add);
        }

        [HttpPut]
        public ActionResult EditTask()
        {
            return NotFound();
        }
        [HttpDelete]
        public ActionResult deleteTask()
        {
            return NotFound();
        }

        [HttpPost]
        public ActionResult AlterPriorityTask()
        {
            return NotFound();
        }
    }
}
