using TodoList.API.Models.Domain;

namespace TodoList.API.Models.DTO
{
	
	public class TaskDto
	{
		public Guid TaskId { get; set; }
		public Guid UserId { get; set; }
		public string TaskName { get; set; }
		public string TaskDescription { get; set; }
		public string TaskStatus { get; set; } 
		public string TaskPriority { get; set; }
		public string? DueDate { get; set; }
		public string CreatedAt { get; set; }
		public string? TimeLeft { get 
			{
				if (DateTime.TryParse(DueDate, out var due))
				{
					var timeLeft = due - DateTime.UtcNow;
					if (timeLeft.TotalDays >= 1)
						return $"{Math.Floor(timeLeft.TotalDays)} day(s) left";
					if (timeLeft.TotalHours >= 1)
						return $"{Math.Floor(timeLeft.TotalHours)} hour(s) left";
					if (timeLeft.TotalMinutes >= 1)
						return $"{Math.Floor(timeLeft.TotalMinutes)} minute(s) left";
					return "Overdue";
				}
				return null;
			} 
		}
	}
}