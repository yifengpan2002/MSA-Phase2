using System.Security.Claims;

namespace Orbit.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>Reads the user id out of the JWT's "sub" claim.</summary>
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue("sub")
                    ?? principal.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(value, out var id) ? id : Guid.Empty;
    }
}