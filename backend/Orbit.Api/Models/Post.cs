namespace Orbit.Api.Models;

public class Post
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;

    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;

    public List<Support> Supports { get; set; } = [];
}