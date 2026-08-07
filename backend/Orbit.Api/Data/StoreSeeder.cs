using Microsoft.EntityFrameworkCore;
using Orbit.Api.Models;

namespace Orbit.Api.Data;

public static class StoreSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        var starTypes = new[]
        {
            new StarType
            {
                Name = "Allen Planet",
                Description = "A copy of Earth, made by aliens.",
                Cost = 25,
                ColorHex = "#E8734A",
                ImageUrl = "/stars/ember.png",
                ModelUrl = "/models/alien.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Magma",
                Description = "A planet filled with the aura of destruction.",
                Cost = 90,
                ColorHex = "#F97316",
                ImageUrl = "/stars/magma.png",
                ModelUrl = "/models/lava.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Green Energy",
                Description = "An asteroid that was destroyed before, but is now full of life again.",
                Cost = 130,
                ColorHex = "#65D67C",
                ImageUrl = "/stars/garden.png",
                ModelUrl = "/models/garden.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Stylized Planet",
                Description = "Legend has it that a child of wind was born.",
                Cost = 150,
                ColorHex = "#35A98B",
                ImageUrl = "/stars/verdant.png",
                ModelUrl = "/models/stylized.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Purple Gas",
                Description = "Another purple light exposure planet.",
                Cost = 240,
                ColorHex = "#A78BFA",
                ImageUrl = "/stars/nebula.png",
                ModelUrl = "/models/purple-gas.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Cottage Planet",
                Description = "A whimsical cottage planet, impossibly cosy for something lost in deep space.",
                Cost = 310,
                ColorHex = "#D6A86E",
                ImageUrl = "/stars/hearth.png",
                ModelUrl = "/models/cottage-small.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Purple Planet",
                Description = "What??? Purple light exposure again???",
                Cost = 375,
                ColorHex = "#4A7FE8",
                ImageUrl = "/stars/sapphire.png",
                ModelUrl = "/models/purple.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Uranium",
                Description = "A radioactive emerald world humming with unstable, forbidden energy.",
                Cost = 625,
                ColorHex = "#B6F44A",
                ImageUrl = "/stars/uranium.png",
                ModelUrl = "/models/uranium.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Dusk",
                Description = "A forbbiden city, looks like it has iron revolution before.",
                Cost = 725,
                ColorHex = "#7C8BA1",
                ImageUrl = "/stars/dusk.png",
                ModelUrl = "/models/dusk.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Solaris",
                Description = "A molten sun-crowned planet wrapped in flares and old gold heat.",
                Cost = 850,
                ColorHex = "#F59E0B",
                ImageUrl = "/stars/solaris.png",
                ModelUrl = "/models/solar-crown.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Devourer",
                Description = "Anything that gets close to this planet will be swallowed up.",
                Cost = 1500,
                ColorHex = "#EF4444",
                ImageUrl = "/stars/devourer.png",
                ModelUrl = "/models/devourer.glb",
                ModelScale = 1.0,
            },
        };

        foreach (var seed in starTypes)
        {
            var matches = await db.StarTypes
                .Where(s =>
                    s.ImageUrl == seed.ImageUrl ||
                    s.Name == seed.Name ||
                    (seed.ModelUrl != null && s.ModelUrl == seed.ModelUrl))
                .OrderByDescending(s => s.Name == seed.Name)
                .ThenBy(s => s.Cost)
                .ThenBy(s => s.Id)
                .ToListAsync();

            var existing = matches.FirstOrDefault();

            if (existing is null)
            {
                db.StarTypes.Add(seed);
                continue;
            }

            ApplySeed(existing, seed);

            foreach (var duplicate in matches.Skip(1))
            {
                var ownedStars = await db.OwnedStars
                    .Where(o => o.StarTypeId == duplicate.Id)
                    .ToListAsync();

                foreach (var ownedStar in ownedStars)
                {
                    ownedStar.StarTypeId = existing.Id;
                }

                db.StarTypes.Remove(duplicate);
            }
        }

        await db.SaveChangesAsync();
    }

    private static void ApplySeed(StarType existing, StarType seed)
    {
        existing.Name = seed.Name;
        existing.Description = seed.Description;
        existing.Cost = seed.Cost;
        existing.ImageUrl = seed.ImageUrl;
        existing.ColorHex = seed.ColorHex;
        existing.ModelUrl = seed.ModelUrl;
        existing.ModelScale = seed.ModelScale;
    }
}
