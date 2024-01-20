using System.ComponentModel.DataAnnotations;

namespace To_do_list.DTOS
{
    public class TaskDTO
    {
     

          
     
            public string Title { get; set; }
            public string? Description { get; set; }
            public string? Due { get; set; }
            public string? type { get; set; }
     
            public string? status { get; set; }

        public string? Priority { get; set; }

        public enum PriorityEnum
        {
            Low,
            Medium,
            High
        }

        public PriorityEnum GetPriorityEnum()
        {
            // Make sure the input string is not null or empty
            if (!string.IsNullOrEmpty(Priority))
            {
                // Use Enum.Parse to convert the string to the corresponding enum value
                if (Enum.TryParse<PriorityEnum>(Priority, out PriorityEnum priorityEnum))
                {
                    return priorityEnum;
                }
                else
                {
                    // Handle the case when the string doesn't match any enum value
                    throw new ArgumentException("Invalid priority value");
                }
            }
            else
            {
                // Handle the case when the input string is null or empty
                throw new ArgumentNullException(nameof(Priority));
            }
        }


        public DateTime DeserializeDate()
        {

           
                // Use DateTime.Parse for automatic parsing based on standard date and time formats
                DateTime parsedDateTime = DateTime.Parse(Due);
                return parsedDateTime;
                // Alternatively, you can use DateTime.ParseExact to specify a custom format
                // DateTime parsedDateTime = DateTime.ParseExact(dateString, "yyyy-MM-ddTHH:mm:ss.fffZ", CultureInfo.InvariantCulture);

                Console.WriteLine(parsedDateTime);
            
         }

         
        }
}
