using System.ComponentModel.DataAnnotations;
using TodoList.API.Models.Domain;

namespace TodoList.API.Models.DTO
{
	public class UpdateTaskDto
	{
		[Required]
		[MaxLength(255, ErrorMessage = "Task name cannot exceed 255 characters.")]
		public string TaskName { get; set; }
		[Required]
		[MaxLength(255, ErrorMessage = "Task description cannot exceed 255 characters.")]
		public string TaskDescription { get; set; }
		public string TaskStatus { get; set; }
		public string TaskPriority { get; set; }
		public string? DueDate { get; set; }
	}
}
