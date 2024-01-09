using Microsoft.AspNetCore.Mvc;

namespace To_do_list.Controllers
{
    public class TaskController : Controller
    {
        [HttpGet]
        public ActionResult  GetTasks()
        {
            return NotFound();
        }

        [HttpPost]
        public ActionResult AddTask()
        {
            return NotFound();
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
