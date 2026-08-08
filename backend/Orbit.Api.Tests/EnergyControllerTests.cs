using Microsoft.AspNetCore.Mvc;
using Orbit.Api.Controllers;
using Orbit.Api.Models;
using Xunit;

namespace Orbit.Api.Tests;

public class EnergyControllerTests
{
    [Fact]
    public async Task ClaimDaily_FirstClaimAwardsBaseEnergy()
    {
        await using var db = TestHelpers.CreateDb();
        var user = new User { Username = "demo", Energy = 10 };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var controller = new EnergyController(db);
        TestHelpers.SignIn(controller, user);

        var response = TestHelpers.GetOkValue(await controller.ClaimDaily());
        await db.Entry(user).ReloadAsync();

        Assert.Equal(EnergyRules.BaseDailyReward, response.EnergyAwarded);
        Assert.Equal(1, response.CurrentStreak);
        Assert.Equal(1, response.LongestStreak);
        Assert.Equal(35, response.Energy);
        Assert.Equal(35, user.Energy);
        Assert.NotNull(user.LastClaimUtc);
    }

    [Fact]
    public async Task ClaimDaily_ReturnsConflict_WhenAlreadyClaimedToday()
    {
        await using var db = TestHelpers.CreateDb();
        var user = new User
        {
            Username = "demo",
            Energy = 25,
            CurrentStreak = 1,
            LongestStreak = 1,
            LastClaimUtc = DateTime.UtcNow
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var controller = new EnergyController(db);
        TestHelpers.SignIn(controller, user);

        var result = await controller.ClaimDaily();

        Assert.IsType<ConflictObjectResult>(result.Result);
    }
}

