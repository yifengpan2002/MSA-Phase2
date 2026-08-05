using System.ComponentModel.DataAnnotations;

namespace Orbit.Api.Dtos;

public class RegisterRequest
{
    [Required]
    [StringLength(20, MinimumLength = 3)]
    [RegularExpression("^[a-zA-Z0-9_]+$", ErrorMessage = "Letters, numbers and underscores only.")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public record UserResponse(Guid Id, string Username, DateTime CreatedUtc);

public record AuthResponse(string Token, UserResponse User);