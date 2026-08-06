using Microsoft.Extensions.Options;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Orbit.Api.Data;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Orbit.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var dbPath = Path.Combine(builder.Environment.ContentRootPath, "orbit.db");
    options.UseSqlite($"Data Source={dbPath}");
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services.AddScoped<TokenService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        };
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
else
{

    app.UseHttpsRedirection();
}
app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();


app.MapGet("/api/dbcheck", async (AppDbContext db) => Results.Ok(new
{
    canConnect = await db.Database.CanConnectAsync(),
    users = await db.Users.CountAsync(),
    posts = await db.Posts.CountAsync(),
    supports = await db.Supports.CountAsync(),
}));

app.MapControllers();

app.MapGet("/", () => Results.Ok(new
{
    name = "Orbit API",
    version = "1.0",
    docs = "/scalar",
    health = "/api/health"
}));

app.Run();
