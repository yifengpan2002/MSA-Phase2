using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbit.Api.Data;
using Orbit.Api.Dtos;
using Orbit.Api.Extensions;

namespace Orbit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController(AppDbContext db) : ControllerBase
{
    [HttpGet("me")]
    public async Task<ActionResult<ProfileResponse>> GetMyProfile()
    {
        var userId = User.GetUserId();

        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null) return NotFound();

        var posts = await db.Posts
            .AsNoTracking()
            .Where(p => p.AuthorId == userId)
            .OrderByDescending(p => p.CreatedUtc)
            .Select(p => new ProfilePostSummary(
                p.Id,
                p.Title,
                p.Supports.Count,
                p.CreatedUtc))
            .ToListAsync();

        return Ok(new ProfileResponse(
            user.Id,
            user.Username,
            user.AvatarUrl,
            user.CreatedUtc,
            posts.Count,
            user.Energy,
            posts));
    }

    [HttpPut("me/avatar")]
    public async Task<ActionResult<ProfileResponse>> UpdateAvatar(UpdateAvatarRequest request)
    {
        if (!request.AvatarUrl.StartsWith("data:image/"))
            return BadRequest(new { message = "Avatar must be an image data URL." });

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == User.GetUserId());
        if (user is null) return NotFound();

        user.AvatarUrl = request.AvatarUrl;
        await db.SaveChangesAsync();

        return await GetMyProfile();
    }

    [HttpGet("me/galaxy")]
    public async Task<ActionResult<List<GalaxyPlanet>>> GetMyGalaxy()
    {
        var planets = await db.OwnedStars
            .AsNoTracking()
            .Where(o => o.UserId == User.GetUserId())
            // Stable order matters: galaxy positions come from array index,
            // so this keeps each planet in the same spot between page loads.
            .OrderBy(o => o.AcquiredUtc)
            .Select(o => new GalaxyPlanet(
                o.Id,
                o.StarTypeId,
                o.StarType.Name,
                o.StarType.ColorHex,
                o.StarType.ModelUrl,
                o.StarType.ModelScale,
                o.AcquiredUtc))
            .ToListAsync();

        return Ok(planets);
    }
}