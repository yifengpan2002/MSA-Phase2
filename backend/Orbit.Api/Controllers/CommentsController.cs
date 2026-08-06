using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbit.Api.Data;
using Orbit.Api.Dtos;
using Orbit.Api.Extensions;
using Orbit.Api.Models;

namespace Orbit.Api.Controllers;

[ApiController]
[Route("api/posts/{postId:guid}/comments")]
public class CommentsController(AppDbContext db) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<CommentResponse>> Create(Guid postId, CreateCommentRequest request)
    {
        if (!await db.Posts.AnyAsync(p => p.Id == postId))
            return NotFound(new { message = "That story no longer exists." });

        var authorId = User.GetUserId();
        var author = await db.Users.FirstOrDefaultAsync(u => u.Id == authorId);
        if (author is null) return Unauthorized();

        var comment = new Comment
        {
            PostId = postId,
            AuthorId = author.Id,
            Body = request.Body.Trim(),
        };

        db.Comments.Add(comment);
        await db.SaveChangesAsync();

        return Ok(new CommentResponse(
            comment.Id,
            comment.Body,
            author.Id,
            author.Username,
            author.AvatarUrl,
            comment.CreatedUtc));
    }

    [HttpDelete("{commentId:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid postId, Guid commentId)
    {
        var comment = await db.Comments
            .FirstOrDefaultAsync(c => c.Id == commentId && c.PostId == postId);

        if (comment is null) return NotFound();

        // Only the author can delete their own comment.
        if (comment.AuthorId != User.GetUserId()) return Forbid();

        db.Comments.Remove(comment);
        await db.SaveChangesAsync();

        return NoContent();
    }
}