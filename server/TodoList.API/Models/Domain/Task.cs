namespace TodoList.API.Models.Domain
{
	public class Task
	{
		public Guid TaskId { get; set; }
		public Guid UserId { get; set; }
		public string TaskName { get; set; }
		public string TaskDescription { get; set; }
		public TaskStat TaskStatus { get; set; } = TaskStat.Pending;
		public TaskPriority TaskPriority { get; set; } = TaskPriority.Medium;
		public DateTime? DueDate { get; set; }
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
	}
}
