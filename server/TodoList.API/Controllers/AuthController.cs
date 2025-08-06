using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoList.API.Models.DTO;
using TodoList.API.Models.Identity;
using TodoList.API.Repositories;

namespace TodoList.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly UserManager<ApplicationUser> userManager;
		private readonly ITokenRepository tokenRepository;

		public AuthController(UserManager<ApplicationUser> userManager, ITokenRepository tokenRepository)
		{
			this.userManager = userManager;
			this.tokenRepository = tokenRepository;
		}

		[HttpPost]
		[Route("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
		{
			var existingUser = await userManager.FindByEmailAsync(registerDto.Username);

			if(existingUser != null) return BadRequest("Email already taken!");

			if(registerDto.Password != registerDto.ConfirmPassword) return BadRequest("Password and Confirm Password do not match.");
			
			var identityUser = new ApplicationUser
			{
				UserName = registerDto.Username,
				Email = registerDto.Username,
			};

			var identityResult = await userManager.CreateAsync(identityUser, registerDto.Password);

			if (identityResult.Succeeded) return Ok(new { message = "User registered successsfully! Please login" });

			return BadRequest("User registration failed. Please enter valid details");
		}

		[HttpPost]
		[Route("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
		{
			var user = await userManager.FindByEmailAsync(loginDto.Username);
			if (user == null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
				return BadRequest("Username or password incorrect");

			var accessToken = tokenRepository.CreateJWTToken(user);
			var refreshToken = tokenRepository.GenerateRefreshToken();

			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
			await userManager.UpdateAsync(user);

			return Ok(new LoginResponseDto
			{
				AccessToken = accessToken,
				RefreshToken = refreshToken
			});
		}

		[HttpPost("refresh-token")]
		public async Task<IActionResult> RefreshToken([FromBody] TokenRequestDto tokenRequest)
		{
			var principal = tokenRepository.GetPrincipalFromExpiredToken(tokenRequest.AccessToken);
			var email = principal?.FindFirst(ClaimTypes.Email)?.Value;

			if (email == null)
				return BadRequest("Invalid token - email not found");

			var user = await userManager.FindByEmailAsync(email);
			if (user == null ||
				user.RefreshToken != tokenRequest.RefreshToken ||
				user.RefreshTokenExpiryTime <= DateTime.UtcNow)
			{
				return BadRequest("Invalid refresh token");
			}

			var newAccessToken = tokenRepository.CreateJWTToken(user);
			var newRefreshToken = tokenRepository.GenerateRefreshToken();

			user.RefreshToken = newRefreshToken;
			user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
			await userManager.UpdateAsync(user);

			return Ok(new LoginResponseDto
			{
				AccessToken = newAccessToken,
				RefreshToken = newRefreshToken
			});
		}
	}
}
