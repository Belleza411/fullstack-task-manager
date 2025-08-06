using AutoMapper;
using TodoList.API.Models;
using TodoList.API.Models.DTO;
using TodoList.API.Models.Domain;
using System.Globalization;

namespace TodoList.API.Mapper
{
	public class AutoMapperProfiles : Profile
	{
		public AutoMapperProfiles()
		{
			// Domain to DTO with formatted dates
			CreateMap<Models.Domain.Task, TaskDto>()
				.ForMember(dest => dest.DueDate, opt => opt.MapFrom(src =>
					src.DueDate.HasValue ? src.DueDate.Value.ToString("MMMM d yyyy", CultureInfo.InvariantCulture) : null))
				.ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src =>
					src.CreatedAt.ToString("MMMM d yyyy", CultureInfo.InvariantCulture)))
				.ForMember(dest => dest.TaskStatus, opt => opt.MapFrom(src => src.TaskStatus.ToString()))
				.ForMember(dest => dest.TaskId, opt => opt.MapFrom(src => src.TaskId))
				.ForMember(dest => dest.TaskName, opt => opt.MapFrom(src => src.TaskName))
				.ForMember(dest => dest.TaskDescription, opt => opt.MapFrom(src => src.TaskDescription));


			// DTO to Domain
			CreateMap<CreateTaskDto, Models.Domain.Task>().ReverseMap();
			CreateMap<UpdateTaskDto, Models.Domain.Task>().ReverseMap();
			CreateMap<CompleteTaskDto, Models.Domain.Task>()
				.ForMember(dest => dest.TaskStatus, opt => opt.MapFrom(src => src.TaskStatus.ToString()));
		}
	}
}
