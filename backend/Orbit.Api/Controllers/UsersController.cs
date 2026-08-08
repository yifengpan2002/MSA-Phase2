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

    [HttpDelete("me/galaxy/{ownedStarId:guid}")]
    public async Task<IActionResult> DeleteOwnedPlanet(Guid ownedStarId)
    {
        var userId = User.GetUserId();

        var ownedPlanet = await db.OwnedStars
            .FirstOrDefaultAsync(o => o.Id == ownedStarId && o.UserId == userId);

        if (ownedPlanet is null) return NotFound();

        // Removing a planet is cosmetic cleanup only. Energy is not refunded,
        // otherwise users could repeatedly buy/delete planets to manipulate progress.
        db.OwnedStars.Remove(ownedPlanet);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("galaxy/leaderboard")]
    public async Task<ActionResult<GalaxyLeaderboardResponse>> GetGalaxyLeaderboard()
    {
        var currentUserId = User.GetUserId();

        var users = await db.Users
            .AsNoTracking()
            .Select(user => new
            {
                UserId = user.Id,
                user.Username,
                user.AvatarUrl,
                PlanetCount = db.OwnedStars.Count(star => star.UserId == user.Id),
                TotalEnergySpent = db.OwnedStars
                    .Where(star => star.UserId == user.Id)
                    .Sum(star => (int?)star.StarType.Cost) ?? 0
            })
            .OrderByDescending(user => user.TotalEnergySpent)
            .ThenByDescending(user => user.PlanetCount)
            .ThenBy(user => user.Username)
            .ToListAsync();

        var rankedUsers = users
            .Select((user, index) => new GalaxyLeaderboardEntry(
                user.UserId,
                user.Username,
                user.AvatarUrl,
                user.PlanetCount,
                user.TotalEnergySpent,
                index + 1))
            .ToList();

        var topUsers = rankedUsers.Take(3).ToList();
        var currentUser = rankedUsers.FirstOrDefault(user => user.UserId == currentUserId);

        return Ok(new GalaxyLeaderboardResponse(
            topUsers,
            currentUser,
            rankedUsers.Count));
    }

    [AllowAnonymous]
    [HttpGet("{username}")]
    public async Task<ActionResult<ProfileResponse>> GetPublicProfile(string username)
    {
        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user is null) return NotFound();

        var posts = await db.Posts
            .AsNoTracking()
            .Where(p => p.AuthorId == user.Id)
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
    [AllowAnonymous]
    [HttpGet("{username}/galaxy")]
    public async Task<ActionResult<List<GalaxyPlanet>>> GetPublicGalaxy(string username)
    {
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Username == username);
        if (user is null) return NotFound();

        var planets = await db.OwnedStars.AsNoTracking()
        .Where(o => o.UserId == user.Id)
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
