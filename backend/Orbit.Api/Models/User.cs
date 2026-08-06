namespace Orbit.Api.Models;

public class User
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Username { get; set; } = string.Empty;
  public string PasswordHash { get; set; } = string.Empty;
  public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
  public List<Post> Posts { get; set; } = new List<Post>();
  public List<Support> Supports { get; set; } = new List<Support>();
  /// <summary>Base64 data URL, resized to 256x256 on the client.</summary>
  public string? AvatarUrl { get; set; }
  public List<Comment> Comments { get; set; } = [];
}