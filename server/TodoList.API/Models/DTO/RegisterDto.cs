using System.ComponentModel.DataAnnotations;

namespace TodoList.API.Models.DTO
{
	public class RegisterDto
	{
		[Required]
		[DataType(DataType.EmailAddress)]
		public string Username { get; set; }
		[Required]
		[DataType(DataType.Password)]
		public string Password { get; set; }

		[Required]
		[DataType(DataType.Password)]
		[Compare("Password", ErrorMessage ="Password and Confirm Password do not match")]
		public string ConfirmPassword { get; set; }
	}
}
