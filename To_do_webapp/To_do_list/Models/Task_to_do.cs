using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;


namespace To_do_list.Models
{
    public class Task_to_do
    {

        [Required]
        public Guid TaskID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime createdAt { get; set; }
        public DateTime updatedAt { get; set; }
        public DateTime Due { get; set; }
        public string type { get; set; }
        public Priority priority { get; set; }
        public string status { get; set; }

        public enum Priority
        {
            Low,
            Medium,
            High
        }

    }
}



