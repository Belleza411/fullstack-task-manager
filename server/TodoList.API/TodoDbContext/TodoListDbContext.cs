using Microsoft.EntityFrameworkCore;
using TodoList.API.Models.Domain;

namespace TodoList.API.TodoDbContext
{
	public class TodoListDbContext : DbContext
	{
		public TodoListDbContext(DbContextOptions<TodoListDbContext> options) : base(options)
		{
		}
		public DbSet<Models.Domain.Task> Tasks { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			modelBuilder.Entity<Models.Domain.Task>()
				.HasKey(t => t.TaskId);
		}
	}
}
