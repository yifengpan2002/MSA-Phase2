using Microsoft.AspNetCore.Mvc;
using Orbit.Api.Controllers;
using Orbit.Api.Dtos;
using Orbit.Api.Models;
using Xunit;

namespace Orbit.Api.Tests;

public class CommentsControllerTests
{
    [Fact]
    public async Task Create_AddsTrimmedCommentToExistingPost()
    {
        await using var db = TestHelpers.CreateDb();
        var author = new User { Username = "writer" };
        var commenter = new User { Username = "reader" };
        var post = new Post { Author = author, Title = "Story", Body = "Body" };

        db.Users.AddRange(author, commenter);
        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var controller = new CommentsController(db);
        TestHelpers.SignIn(controller, commenter);

        var result = await controller.Create(post.Id, new CreateCommentRequest
        {
            Body = "  Great story!  "
        });

        var response = TestHelpers.GetOkValue(result);
        var savedComment = Assert.Single(db.Comments);

        Assert.Equal("Great story!", response.Body);
        Assert.Equal(commenter.Id, response.AuthorId);
        Assert.Equal(post.Id, savedComment.PostId);
    }

    [Fact]
    public async Task Create_ReturnsNotFound_WhenPostDoesNotExist()
    {
        await using var db = TestHelpers.CreateDb();
        var commenter = new User { Username = "reader" };
        db.Users.Add(commenter);
        await db.SaveChangesAsync();

        var controller = new CommentsController(db);
        TestHelpers.SignIn(controller, commenter);

        var result = await controller.Create(Guid.NewGuid(), new CreateCommentRequest
        {
            Body = "Where did the story go?"
        });

        Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.Empty(db.Comments);
    }

    [Fact]
    public async Task Delete_AllowsOnlyCommentAuthor()
    {
        await using var db = TestHelpers.CreateDb();
        var postAuthor = new User { Username = "writer" };
        var commentAuthor = new User { Username = "commenter" };
        var otherUser = new User { Username = "other" };
        var post = new Post { Author = postAuthor, Title = "Story", Body = "Body" };
        var comment = new Comment { Post = post, Author = commentAuthor, Body = "Nice" };

        db.Users.AddRange(postAuthor, commentAuthor, otherUser);
        db.Posts.Add(post);
        db.Comments.Add(comment);
        await db.SaveChangesAsync();

        var controller = new CommentsController(db);
        TestHelpers.SignIn(controller, otherUser);

        var forbidden = await controller.Delete(post.Id, comment.Id);
        Assert.IsType<ForbidResult>(forbidden);

        TestHelpers.SignIn(controller, commentAuthor);

        var deleted = await controller.Delete(post.Id, comment.Id);
        Assert.IsType<NoContentResult>(deleted);
        Assert.Empty(db.Comments);
    }
}

