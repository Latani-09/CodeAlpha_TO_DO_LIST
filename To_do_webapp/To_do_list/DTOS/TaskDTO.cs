using System.ComponentModel.DataAnnotations;
using System.Globalization;

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
            High,
            Default
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
                return PriorityEnum.Default;
            }
        }


        public DateTime? DeserializeDate()
        {
            if (Due != null)
            {
                // Use DateTime.TryParseExact to attempt parsing with a specific format
                if (DateTime.TryParse(Due, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDateTime))
                {
                    return parsedDateTime;
                }
                else
                {
                    // Return null if the date is not in the expected format
                    return null;
                }
            }
            else
            {
                // Return null if Due is null
                return null;
            }
        }


    }
}
