using System.ComponentModel.DataAnnotations;

namespace Orbit.Api.Dtos;

public record CommentResponse(
    Guid Id,
    string Body,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    DateTime CreatedUtc
);

public record PostDetailResponse(
    Guid Id,
    string Title,
    string Body,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    int energyCount,
    DateTime CreatedUtc,
    List<CommentResponse> Comments
);

public class CreateCommentRequest
{
    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public string Body { get; set; } = string.Empty;
}