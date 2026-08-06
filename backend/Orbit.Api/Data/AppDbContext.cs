using Microsoft.EntityFrameworkCore;
using Orbit.Api.Models;

namespace Orbit.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Support> Supports => Set<Support>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.Property(u => u.Username).HasMaxLength(20).IsRequired();
            entity.Property(u => u.AvatarUrl).HasMaxLength(250_000);
        });

        builder.Entity<Post>(entity =>
        {
            entity.Property(p => p.Title).HasMaxLength(120).IsRequired();
            entity.Property(p => p.Body).HasMaxLength(20000).IsRequired();

            entity.HasOne(p => p.Author)
                  .WithMany(u => u.Posts)
                  .HasForeignKey(p => p.AuthorId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Support>(entity =>
        {
            // One support per user per post, enforced by the database itself.
            entity.HasIndex(s => new { s.UserId, s.PostId }).IsUnique();

            entity.HasOne(s => s.Post)
                  .WithMany(p => p.Supports)
                  .HasForeignKey(s => s.PostId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(s => s.User)
                  .WithMany(u => u.Supports)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Comment>(entity =>
        {
            entity.Property(c => c.Body).HasMaxLength(1000).IsRequired();

            // The detail page reads a post's comments oldest-first.
            entity.HasIndex(c => new { c.PostId, c.CreatedUtc });

            entity.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Author)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}