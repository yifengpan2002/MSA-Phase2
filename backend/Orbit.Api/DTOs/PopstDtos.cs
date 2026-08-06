using System.ComponentModel.DataAnnotations;

namespace Orbit.Api.Dtos;

public record PostResponse(
    Guid Id,
    string Title,
    string Body,
    Guid AuthorId,
    string AuthorName,
    int SupportCount,
    DateTime CreatedUtc
);

public class CreatePostRequest
{
    [Required]
    [StringLength(120, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(20000, MinimumLength = 1)]
    public string Body { get; set; } = string.Empty;
}