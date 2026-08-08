using Microsoft.AspNetCore.Mvc;
using Orbit.Api.Controllers;
using Orbit.Api.Models;
using Xunit;

namespace Orbit.Api.Tests;

public class UsersControllerTests
{
    [Fact]
    public async Task GetPublicProfile_ReturnsPostsForRequestedUser()
    {
        await using var db = TestHelpers.CreateDb();
        var writer = new User { Username = "writer", Energy = 75 };
        var other = new User { Username = "other" };

        db.Users.AddRange(writer, other);
        db.Posts.AddRange(
            new Post { Author = writer, Title = "Writer story", Body = "Body" },
            new Post { Author = other, Title = "Other story", Body = "Body" });
        await db.SaveChangesAsync();

        var controller = new UsersController(db);

        var response = TestHelpers.GetOkValue(await controller.GetPublicProfile("writer"));

        Assert.Equal("writer", response.Username);
        Assert.Equal(75, response.TotalEnergy);
        Assert.Single(response.Posts);
        Assert.Equal("Writer story", response.Posts[0].Title);
    }

    [Fact]
    public async Task UpdateAvatar_RejectsNonImageDataUrl()
    {
        await using var db = TestHelpers.CreateDb();
        var user = new User { Username = "demo" };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var controller = new UsersController(db);
        TestHelpers.SignIn(controller, user);

        var result = await controller.UpdateAvatar(new Dtos.UpdateAvatarRequest
        {
            AvatarUrl = "https://example.com/avatar.png"
        });

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task GetGalaxyLeaderboard_RanksUsersByTotalEnergySpent()
    {
        await using var db = TestHelpers.CreateDb();
        var cheap = new StarType { Name = "Cheap", Description = "", Cost = 50, ImageUrl = "", ColorHex = "#fff" };
        var expensive = new StarType { Name = "Expensive", Description = "", Cost = 300, ImageUrl = "", ColorHex = "#fff" };

        var first = new User { Username = "alpha" };
        var second = new User { Username = "beta" };
        var current = new User { Username = "current" };
        var fourth = new User { Username = "delta" };

        db.StarTypes.AddRange(cheap, expensive);
        db.Users.AddRange(first, second, current, fourth);
        db.OwnedStars.AddRange(
            new OwnedStar { User = first, StarType = expensive },
            new OwnedStar { User = first, StarType = cheap },
            new OwnedStar { User = second, StarType = expensive },
            new OwnedStar { User = current, StarType = cheap },
            new OwnedStar { User = fourth, StarType = cheap });
        await db.SaveChangesAsync();

        var controller = new UsersController(db);
        TestHelpers.SignIn(controller, current);

        var response = TestHelpers.GetOkValue(await controller.GetGalaxyLeaderboard());

        Assert.Equal(4, response.TotalUsers);
        Assert.Equal(["alpha", "beta", "current"], response.TopUsers.Select(user => user.Username));
        Assert.Equal("current", response.CurrentUser?.Username);
        Assert.Equal(3, response.CurrentUser?.Rank);
        Assert.Equal(50, response.CurrentUser?.TotalEnergySpent);
    }

    [Fact]
    public async Task DeleteOwnedPlanet_RemovesOnlyCurrentUsersPlanet()
    {
        await using var db = TestHelpers.CreateDb();
        var user = new User { Username = "owner" };
        var star = new StarType { Name = "Purple", Description = "", Cost = 100, ImageUrl = "", ColorHex = "#fff" };
        var ownedStar = new OwnedStar { User = user, StarType = star };

        db.Users.Add(user);
        db.StarTypes.Add(star);
        db.OwnedStars.Add(ownedStar);
        await db.SaveChangesAsync();

        var controller = new UsersController(db);
        TestHelpers.SignIn(controller, user);

        var result = await controller.DeleteOwnedPlanet(ownedStar.Id);

        Assert.IsType<NoContentResult>(result);
        Assert.Empty(db.OwnedStars);
    }

    [Fact]
    public async Task DeleteOwnedPlanet_ReturnsNotFound_ForAnotherUsersPlanet()
    {
        await using var db = TestHelpers.CreateDb();
        var owner = new User { Username = "owner" };
        var other = new User { Username = "other" };
        var star = new StarType { Name = "Purple", Description = "", Cost = 100, ImageUrl = "", ColorHex = "#fff" };
        var ownedStar = new OwnedStar { User = owner, StarType = star };

        db.Users.AddRange(owner, other);
        db.StarTypes.Add(star);
        db.OwnedStars.Add(ownedStar);
        await db.SaveChangesAsync();

        var controller = new UsersController(db);
        TestHelpers.SignIn(controller, other);

        var result = await controller.DeleteOwnedPlanet(ownedStar.Id);

        Assert.IsType<NotFoundResult>(result);
        Assert.Single(db.OwnedStars);
    }
}
