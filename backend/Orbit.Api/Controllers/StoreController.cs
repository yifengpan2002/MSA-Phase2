using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbit.Api.Data;
using Orbit.Api.Dtos;
using Orbit.Api.Extensions;
using Orbit.Api.Models;

namespace Orbit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StoreController(AppDbContext db) : ControllerBase
{
    [HttpGet("stars")]
    public async Task<ActionResult<List<StarTypeResponse>>> GetStars()
    {
        var userId = User.GetUserId();

        var stars = await db.StarTypes
            .AsNoTracking()
            .OrderBy(s => s.Cost)
            .Select(s => new StarTypeResponse(
                s.Id, s.Name, s.Description, s.Cost, s.ImageUrl, s.ColorHex,
                db.OwnedStars.Count(o => o.StarTypeId == s.Id && o.UserId == userId)))
            .ToListAsync();

        return Ok(stars);
    }

    [HttpPost("stars/{starTypeId:guid}/purchase")]
    public async Task<ActionResult<PurchaseResponse>> Purchase(Guid starTypeId)
    {
        var star = await db.StarTypes.FirstOrDefaultAsync(s => s.Id == starTypeId);
        if (star is null) return NotFound();

        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == User.GetUserId());
        if (user is null) return Unauthorized();

        // The price check belongs here, not in React — the client can't be trusted.
        if (user.Energy < star.Cost)
            return BadRequest(new { message = $"You need {star.Cost - user.Energy} more energy." });

        user.Energy -= star.Cost;
        db.OwnedStars.Add(new OwnedStar { UserId = user.Id, StarTypeId = star.Id });

        await db.SaveChangesAsync();

        var owned = await db.OwnedStars.CountAsync(o => o.StarTypeId == star.Id && o.UserId == user.Id);
        return Ok(new PurchaseResponse(user.Energy, owned));
    }
}