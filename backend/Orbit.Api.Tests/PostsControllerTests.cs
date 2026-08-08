using Microsoft.AspNetCore.Mvc;
using Orbit.Api.Controllers;
using Orbit.Api.Dtos;
using Orbit.Api.Models;
using Xunit;

namespace Orbit.Api.Tests;

public class PostsControllerTests
{
    [Fact]
    public async Task Create_TrimsTitleAndBody_AndReturnsCreatedPost()
    {
        await using var db = TestHelpers.CreateDb();
        var author = new User { Username = "writer" };
        db.Users.Add(author);
        await db.SaveChangesAsync();

        var controller = new PostsController(db);
        TestHelpers.SignIn(controller, author);

        var result = await controller.Create(new CreatePostRequest
        {
            Title = "  A clean title  ",
            Body = "  A clean story body  "
        });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var response = Assert.IsType<PostResponse>(created.Value);
        var savedPost = Assert.Single(db.Posts);

        Assert.Equal("A clean title", response.Title);
        Assert.Equal("A clean story body", response.Body);
        Assert.Equal(author.Id, response.AuthorId);
        Assert.Equal("A clean title", savedPost.Title);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTitleOrBodyIsBlank()
    {
        await using var db = TestHelpers.CreateDb();
        var author = new User { Username = "writer" };
        db.Users.Add(author);
        await db.SaveChangesAsync();

        var controller = new PostsController(db);
        TestHelpers.SignIn(controller, author);

        var result = await controller.Create(new CreatePostRequest
        {
            Title = "   ",
            Body = "Story body"
        });

        Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Empty(db.Posts);
    }

    [Fact]
    public async Task ToggleSupport_AwardsAndWithdrawsEnergy()
    {
        await using var db = TestHelpers.CreateDb();
        var author = new User { Username = "author", Energy = 0 };
        var reader = new User { Username = "reader", Energy = 0 };
        var post = new Post { Author = author, Title = "Story", Body = "Body" };

        db.Users.AddRange(author, reader);
        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var controller = new PostsController(db);
        TestHelpers.SignIn(controller, reader);

        var supportResult = TestHelpers.GetOkValue(await controller.ToggleSupport(post.Id));
        await db.Entry(author).ReloadAsync();

        Assert.True(supportResult.SupportedByMe);
        Assert.Equal(1, supportResult.EnergyCount);
        Assert.Equal(EnergyRules.SupportReward, author.Energy);

        var withdrawResult = TestHelpers.GetOkValue(await controller.ToggleSupport(post.Id));
        await db.Entry(author).ReloadAsync();

        Assert.False(withdrawResult.SupportedByMe);
        Assert.Equal(0, withdrawResult.EnergyCount);
        Assert.Equal(0, author.Energy);
    }

    [Fact]
    public async Task ToggleSupport_ReturnsBadRequest_ForOwnPost()
    {
        await using var db = TestHelpers.CreateDb();
        var author = new User { Username = "author" };
        var post = new Post { Author = author, Title = "Story", Body = "Body" };

        db.Users.Add(author);
        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var controller = new PostsController(db);
        TestHelpers.SignIn(controller, author);

        var result = await controller.ToggleSupport(post.Id);

        Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.Empty(db.Supports);
    }
}

