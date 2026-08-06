using System.ComponentModel.DataAnnotations;

namespace Orbit.Api.Dtos;

public record ProfilePostSummary(
    Guid Id,
    string Title,
    int EnergyCount,
    DateTime CreatedUtc
);

public record ProfileResponse(
    Guid Id,
    string Username,
    string? AvatarUrl,
    DateTime CreatedUtc,
    int PostCount,
    int TotalEnergy,
    List<ProfilePostSummary> Posts
);

public class UpdateAvatarRequest
{
    [Required]
    [StringLength(250_000, MinimumLength = 30)]
    public string AvatarUrl { get; set; } = string.Empty;
}