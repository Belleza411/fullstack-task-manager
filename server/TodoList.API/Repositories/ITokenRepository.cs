using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace TodoList.API.Repositories
{
	public interface ITokenRepository
	{
		string CreateJWTToken(IdentityUser user);
		string GenerateRefreshToken();
		ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
	}
}
