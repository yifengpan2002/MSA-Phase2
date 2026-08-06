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
    public async Task<ActionResult<List<PostResponse>>> GetAll([FromQuery] string sort = "newest")
    {
        var query = db.Posts.AsNoTracking();

        query = sort switch
        {
            "supported" => query.OrderByDescending(p => p.Supports.Count),
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

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PostResponse>> GetById(Guid id)
    {
        var post = await db.Posts
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PostResponse(
                p.Id, p.Title, p.Body, p.AuthorId,
                p.Author.Username, p.Supports.Count, p.CreatedUtc))
            .FirstOrDefaultAsync();

        return post is null ? NotFound() : Ok(post);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PostResponse>> Create(CreatePostRequest request)
    {
        var authorId = User.GetUserId();
        var author = await db.Users.FirstOrDefaultAsync(u => u.Id == authorId);
        if (author is null) return Unauthorized();

        var post = new Post
        {
            Title = request.Title.Trim(),
            Body = request.Body.Trim(),
            AuthorId = author.Id,
        };

        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var response = new PostResponse(
            post.Id, post.Title, post.Body, author.Id, author.Username, 0, post.CreatedUtc);

        return CreatedAtAction(nameof(GetById), new { id = post.Id }, response);
    }
}