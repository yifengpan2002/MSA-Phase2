using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Orbit.Api.Controllers;
using Orbit.Api.Dtos;
using Orbit.Api.Services;
using Xunit;

namespace Orbit.Api.Tests;

public class AuthControllerTests
{
    [Fact]
    public async Task Register_CreatesUserWithHashedPasswordAndToken()
    {
        await using var db = TestHelpers.CreateDb();
        var controller = new AuthController(db, CreateTokenService());

        var result = await controller.Register(new RegisterRequest
        {
            Username = " newuser ",
            Password = "password123"
        });

        var response = TestHelpers.GetOkValue(result);
        var savedUser = Assert.Single(db.Users);

        Assert.Equal("newuser", response.User.Username);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
        Assert.Equal("newuser", savedUser.Username);
        Assert.NotEqual("password123", savedUser.PasswordHash);
        Assert.True(BCrypt.Net.BCrypt.Verify("password123", savedUser.PasswordHash));
    }

    [Fact]
    public async Task Register_ReturnsConflict_WhenUsernameAlreadyExists()
    {
        await using var db = TestHelpers.CreateDb();
        var controller = new AuthController(db, CreateTokenService());

        await controller.Register(new RegisterRequest
        {
            Username = "demo",
            Password = "password123"
        });

        var result = await controller.Register(new RegisterRequest
        {
            Username = "demo",
            Password = "password123"
        });

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenPasswordIsWrong()
    {
        await using var db = TestHelpers.CreateDb();
        var controller = new AuthController(db, CreateTokenService());

        await controller.Register(new RegisterRequest
        {
            Username = "demo",
            Password = "password123"
        });

        var result = await controller.Login(new LoginRequest
        {
            Username = "demo",
            Password = "wrongpassword"
        });

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }

    [Fact]
    public async Task Login_ReturnsToken_WhenCredentialsAreCorrect()
    {
        await using var db = TestHelpers.CreateDb();
        var controller = new AuthController(db, CreateTokenService());

        await controller.Register(new RegisterRequest
        {
            Username = "demo",
            Password = "password123"
        });

        var result = await controller.Login(new LoginRequest
        {
            Username = " demo ",
            Password = "password123"
        });

        var response = TestHelpers.GetOkValue(result);

        Assert.Equal("demo", response.User.Username);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
    }

    private static TokenService CreateTokenService()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "test-secret-key-test-secret-key-123456",
                ["Jwt:Issuer"] = "OrbitApiTests",
                ["Jwt:Audience"] = "OrbitClientTests",
                ["Jwt:ExpiryHours"] = "24"
            })
            .Build();

        return new TokenService(config);
    }
}

