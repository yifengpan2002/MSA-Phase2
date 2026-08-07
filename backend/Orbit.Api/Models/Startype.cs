namespace Orbit.Api.Models;

/// <summary>Store catalogue. Seeded by the app, never created by users.</summary>
public class StarType
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Cost { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ColorHex { get; set; } = "#FFFFFF";
}