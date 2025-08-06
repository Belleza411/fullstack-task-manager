using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using TodoList.API.CustomValidation;
using TodoList.API.Models;
using TodoList.API.Models.Domain;
using TodoList.API.Models.DTO;
using TodoList.API.TodoDbContext;

namespace TodoList.API.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class TasksController : ControllerBase
	{
		private readonly TodoListDbContext context;
		private readonly IMapper mapper;

		public TasksController(TodoListDbContext context, IMapper mapper)
		{
			this.context = context;
			this.mapper = mapper;
		}

		[HttpGet]
		[EnableRateLimiting("FixedPolicy")]
		public async Task<IActionResult> GetTask()
		{
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized();

			var tasks = await context.Tasks
				.AsNoTracking()
				.Where(x => x.UserId == Guid.Parse(userId))
				.ToListAsync();

			return Ok(mapper.Map<List<TaskDto>>(tasks));
		}

		[HttpGet]
		[Route("{id:Guid}")]
		public async Task<IActionResult> GetTaskById([FromRoute] Guid id)
		{
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized();

			var task = await context.Tasks.FirstOrDefaultAsync(x => x.TaskId == id && x.UserId == Guid.Parse(userId));
			if (task == null) return NotFound();

			return Ok(mapper.Map<TaskDto>(task));
		}

		[ValidateModel]
		[HttpPost]
		[EnableRateLimiting("FixedPolicy")]
		public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto createTaskDto)
		{
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized();

			var taskDomainModel = mapper.Map<Models.Domain.Task>(createTaskDto);
			taskDomainModel.UserId = Guid.Parse(userId);

			await context.Tasks.AddAsync(taskDomainModel);
			await context.SaveChangesAsync();

			var taskDto = mapper.Map<TaskDto>(taskDomainModel);

			return CreatedAtAction(nameof(GetTaskById), new { id = taskDomainModel.TaskId }, taskDto);		
		}

		[ValidateModel]
		[HttpPut]
		[Route("{id:Guid}")]
		public async Task<IActionResult> UpdateTask([FromRoute] Guid id, [FromBody] UpdateTaskDto updateTaskDto)
		{
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized();

			var task = await context.Tasks.FirstOrDefaultAsync(x => x.TaskId == id && x.UserId == Guid.Parse(userId));
			if (task == null) return NotFound();

			mapper.Map(updateTaskDto, task);

			await context.SaveChangesAsync();

			return Ok(mapper.Map<TaskDto>(task));
		}

		[HttpDelete]
		[Route("{id:Guid}")]
		public async Task<IActionResult> DeleteTask([FromRoute] Guid id)
		{
			var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
			if (userId == null) return Unauthorized();

			var task = await context.Tasks.FirstOrDefaultAsync(x => x.TaskId == id && x.UserId == Guid.Parse(userId));
			if (task == null) return NotFound();

			context.Tasks.Remove(task);
			await context.SaveChangesAsync();

			return Ok(mapper.Map<TaskDto>(task));
		}
	}
}
