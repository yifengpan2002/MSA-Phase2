namespace Orbit.Api.Models;

public class User
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Username { get; set; } = string.Empty;
  public string PasswordHash { get; set; } = string.Empty;
  public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
  public List<Post> Posts { get; set; } = new List<Post>();
  public List<Support> Supports { get; set; } = new List<Support>();
  ///Base64 data URL, resized to 256x256 on the client.
  public string? AvatarUrl { get; set; }
  public List<Comment> Comments { get; set; } = [];
  /// Spendable balance. Earned from daily logins and supports, spent in the store.
  public int Energy { get; set; }

  public int CurrentStreak { get; set; }
  public int LongestStreak { get; set; }

  ///UTC date of the last claim. Null until the first one.</summary>
  public DateTime? LastClaimUtc { get; set; }

  public List<OwnedStar> Stars { get; set; } = [];
}