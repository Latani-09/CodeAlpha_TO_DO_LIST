using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
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
      

        public TodoTaskController( ApplicationDbContext datacontext)
        {
            _datacontext = datacontext;
            
        }


        [HttpGet("gettasks")]
        public async Task<ActionResult<List<Task_to_do>>> GetTasks()
        {
            var tasks = _datacontext.Tasks
            .OrderBy(t => t.Due) // Order by DueDate in ascending order
            .ThenBy(t => t.priority)
            .ToList();

            return Ok(tasks);
        }

        [HttpPost("addtask")]
        public async Task<ActionResult> AddTask([FromBody] TaskDTO task)
        {
            var task_to_add = new Task_to_do()
            {
                TaskID = new Guid(),
                Title = task.Title,
                createdAt = DateTime.Now,
                Description = task.Description,
                status = task.status,
                priority = (Task_to_do.Priority?)task.GetPriorityEnum(),
                Due = task.DeserializeDate(),
                type = task.type,

            };

            await _datacontext.Tasks.AddAsync(task_to_add);
            await _datacontext.SaveChangesAsync();

            Console.WriteLine("adding task ---------'", task_to_add);

            return Ok(task_to_add);
        }

        [HttpPut("editDue")]
        public async Task<ActionResult> EditDue([FromBody] TaskDTO task)
        {
            var taskEdit = await _datacontext.Tasks
                .Where(taskToEdit => taskToEdit.Title == task.Title)
                .FirstOrDefaultAsync();
            taskEdit.Due = task.DeserializeDate();
            await _datacontext.SaveChangesAsync();



            return Ok();
        }
        [HttpDelete("taskDelete{taskId}")]
        public async  Task<ActionResult> DeleteTask(string taskId)
        {
            var taskDelete = await _datacontext.Tasks
      .Where(t => t.TaskID.ToString() == taskId)
      .FirstOrDefaultAsync();

            if (taskDelete == null)
            {
                return NotFound(); // or any other appropriate response
            }

            _datacontext.Tasks.Remove(taskDelete);
            await _datacontext.SaveChangesAsync();
            return Ok();

        }

        [HttpPost]
        public ActionResult AlterPriorityTask()
        {
            return NotFound();
        }
    }
}
