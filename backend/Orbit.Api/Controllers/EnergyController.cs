using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbit.Api.Data;
using Orbit.Api.Dtos;
using Orbit.Api.Extensions;
using Orbit.Api.Services;

namespace Orbit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EnergyController(AppDbContext db) : ControllerBase
{
    [HttpGet("daily")]
    public async Task<ActionResult<DailyStatusResponse>> GetDailyStatus()
    {
        var user = await db.Users.AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == User.GetUserId());
        if (user is null) return NotFound();

        var today = GetAppDate(DateTime.UtcNow);

        DateOnly? lastClaim = user.LastClaimUtc is null
            ? null
            : GetAppDate(user.LastClaimUtc.Value);

        var canClaim = lastClaim != today;

        // A gap of more than one day breaks the streak, so the next claim starts over.
        var nextStreakDay = lastClaim == today.AddDays(-1) ? user.CurrentStreak + 1 : 1;

        return Ok(new DailyStatusResponse(
            canClaim,
            user.CurrentStreak,
            user.LongestStreak,
            canClaim ? EnergyRules.DailyReward(nextStreakDay) : 0,
            user.Energy,
            user.LastClaimUtc));
    }

    [HttpPost("daily/claim")]
    public async Task<ActionResult<ClaimResponse>> ClaimDaily()
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == User.GetUserId());
        if (user is null) return NotFound();

        var today = DateTime.UtcNow.Date;
        var lastClaim = user.LastClaimUtc?.Date;

        if (lastClaim == today)
            return Conflict(new { message = "You've already claimed today. Come back tomorrow." });

        var continuing = lastClaim == today.AddDays(-1);
        var streakReset = lastClaim is not null && !continuing;

        user.CurrentStreak = continuing ? user.CurrentStreak + 1 : 1;
        user.LongestStreak = Math.Max(user.LongestStreak, user.CurrentStreak);

        var awarded = EnergyRules.DailyReward(user.CurrentStreak);
        user.Energy += awarded;
        user.LastClaimUtc = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return Ok(new ClaimResponse(
            awarded, user.CurrentStreak, user.LongestStreak, user.Energy, streakReset));
    }

    private static DateOnly GetAppDate(DateTime utc)
    {
        TimeZoneInfo zone;

        try
        {
            zone = TimeZoneInfo.FindSystemTimeZoneById("Pacific/Auckland"); // Linux/Azure
        }
        catch
        {
            zone = TimeZoneInfo.FindSystemTimeZoneById("New Zealand Standard Time"); // Windows
        }

        var local = TimeZoneInfo.ConvertTimeFromUtc(utc, zone);
        return DateOnly.FromDateTime(local);
    }
}