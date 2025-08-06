using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TodoList.API.Models.Identity;

namespace TodoList.API.TodoDbContext
{
	public class TodoListAuthDbContext : IdentityDbContext<ApplicationUser>
	{
		public TodoListAuthDbContext(DbContextOptions<TodoListAuthDbContext> options) : base(options)
		{	
		}
	}
}
