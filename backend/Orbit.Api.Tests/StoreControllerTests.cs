using Microsoft.AspNetCore.Mvc;
using Orbit.Api.Controllers;
using Orbit.Api.Models;
using Xunit;

namespace Orbit.Api.Tests;

public class StoreControllerTests
{
    [Fact]
    public async Task Purchase_ReturnsBadRequest_WhenUserDoesNotHaveEnoughEnergy()
    {
        await using var db = TestHelpers.CreateDb();
        var user = new User { Username = "buyer", Energy = 20 };
        var star = new StarType
        {
            Name = "Purple Planet",
            Description = "A test planet.",
            Cost = 100,
            ImageUrl = "",
            ColorHex = "#8f7cff",
            ModelUrl = "/models/purple.glb"
        };

        db.Users.Add(user);
        db.StarTypes.Add(star);
        await db.SaveChangesAsync();

        var controller = new StoreController(db);
        TestHelpers.SignIn(controller, user);

        var result = await controller.Purchase(star.Id);

        Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Empty(db.OwnedStars);
    }

    [Fact]
    public async Task Purchase_DeductsEnergyAndAddsOwnedStar()
    {
        await using var db = TestHelpers.CreateDb();
        var user = new User { Username = "buyer", Energy = 150 };
        var star = new StarType
        {
            Name = "Purple Planet",
            Description = "A test planet.",
            Cost = 100,
            ImageUrl = "",
            ColorHex = "#8f7cff",
            ModelUrl = "/models/purple.glb"
        };

        db.Users.Add(user);
        db.StarTypes.Add(star);
        await db.SaveChangesAsync();

        var controller = new StoreController(db);
        TestHelpers.SignIn(controller, user);

        var result = TestHelpers.GetOkValue(await controller.Purchase(star.Id));
        await db.Entry(user).ReloadAsync();
        var ownedStar = Assert.Single(db.OwnedStars);

        Assert.Equal(50, result.Energy);
        Assert.Equal(1, result.OwnedCount);
        Assert.Equal(50, user.Energy);
        Assert.Equal(user.Id, ownedStar.UserId);
        Assert.Equal(star.Id, ownedStar.StarTypeId);
    }

    [Fact]
    public async Task Purchase_ReturnsNotFound_WhenStarDoesNotExist()
    {
        await using var db = TestHelpers.CreateDb();
        var user = new User { Username = "buyer", Energy = 150 };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var controller = new StoreController(db);
        TestHelpers.SignIn(controller, user);

        var result = await controller.Purchase(Guid.NewGuid());

        Assert.IsType<NotFoundResult>(result.Result);
    }
}

