namespace Orbit.Api.Models;

public class OwnedStar
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid StarTypeId { get; set; }
    public StarType StarType { get; set; } = null!;

    public DateTime AcquiredUtc { get; set; } = DateTime.UtcNow;
}