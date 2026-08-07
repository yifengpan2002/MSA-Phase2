using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbit.Api.Data;
using Orbit.Api.Dtos;
using Orbit.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Orbit.Api.Extensions;

namespace Orbit.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PostResponse>>> GetAll(
        [FromQuery] string sort = "newest",
        [FromQuery] string? search = null)
    {
        var query = db.Posts.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = $"%{search.Trim()}%";
            query = query.Where(p =>
                EF.Functions.Like(p.Title, term) ||
                EF.Functions.Like(p.Body, term) ||
                EF.Functions.Like(p.Author.Username, term));
        }

        query = sort.ToLowerInvariant() switch
        {
            "hottest" or "supported" => query
                .OrderByDescending(p => p.Supports.Count)
                .ThenByDescending(p => p.CreatedUtc),
            "oldest" => query.OrderBy(p => p.CreatedUtc),
            _ => query.OrderByDescending(p => p.CreatedUtc),
        };

        var posts = await query
            .Select(p => new PostResponse(
                p.Id,
                p.Title,
                p.Body,
                p.AuthorId,
                p.Author.Username,
                p.Supports.Count,
                p.CreatedUtc))
            .ToListAsync();

        return Ok(posts);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PostResponse>> Create(CreatePostRequest request)
    {
        var authorId = User.GetUserId();
        var author = await db.Users.FirstOrDefaultAsync(u => u.Id == authorId);
        if (author is null) return Unauthorized();

        var title = request.Title.Trim();
        var body = request.Body.Trim();

        if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(body))
            return BadRequest(new { message = "Title and story body are required." });

        var post = new Post
        {
            Title = title,
            Body = body,
            AuthorId = author.Id,
        };

        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var response = new PostResponse(
            post.Id, post.Title, post.Body, author.Id, author.Username, 0, post.CreatedUtc);

        return CreatedAtAction(nameof(GetById), new { id = post.Id }, response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PostDetailResponse>> GetById(Guid id)
    {
        var post = await db.Posts
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PostDetailResponse(
                p.Id,
                p.Title,
                p.Body,
                p.AuthorId,
                p.Author.Username,
                p.Author.AvatarUrl,
                p.Supports.Count,
                p.CreatedUtc,
                p.Comments
                    .OrderBy(c => c.CreatedUtc)
                    .Select(c => new CommentResponse(
                        c.Id,
                        c.Body,
                        c.AuthorId,
                        c.Author.Username,
                        c.Author.AvatarUrl,
                        c.CreatedUtc))
                    .ToList()))
            .FirstOrDefaultAsync();

        return post is null ? NotFound() : Ok(post);
    }

    [HttpPost("{id:guid}/support")]
    [Authorize]
    public async Task<ActionResult<SupportResponse>> ToggleSupport(Guid id)
    {
        var post = await db.Posts.FirstOrDefaultAsync(p => p.Id == id);
        if (post is null) return NotFound();

        var userId = User.GetUserId();

        if (post.AuthorId == userId)
            return BadRequest(new { message = "You can't support your own story." });

        var existing = await db.Supports
            .FirstOrDefaultAsync(s => s.PostId == id && s.UserId == userId);

        if (existing is not null)
        {
            // Withdrawing support takes the energy back, so it can't be farmed.
            db.Supports.Remove(existing);
            var author = await db.Users.FirstAsync(u => u.Id == post.AuthorId);
            author.Energy = Math.Max(0, author.Energy - EnergyRules.SupportReward);
        }
        else
        {
            db.Supports.Add(new Support { PostId = id, UserId = userId });
            var author = await db.Users.FirstAsync(u => u.Id == post.AuthorId);
            author.Energy += EnergyRules.SupportReward;
        }

        await db.SaveChangesAsync();

        var count = await db.Supports.CountAsync(s => s.PostId == id);
        return Ok(new SupportResponse(count, existing is null));
    }
}
