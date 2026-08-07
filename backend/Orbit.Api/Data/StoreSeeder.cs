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
                Cost = 50,
                ColorHex = "#E8734A",
                ImageUrl = "/stars/ember.png",
                ModelUrl = "/models/alien.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Lava",
                Description = "A lava planet with a molten surface and a fiery aura.",
                Cost = 120,
                ColorHex = "#E8B93F",
                ImageUrl = "/stars/beacon.png",
                ModelUrl = "/models/planet.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Magma",
                Description = "A planet filled with the aura of destruction.",
                Cost = 180,
                ColorHex = "#F97316",
                ImageUrl = "/stars/magma.png",
                ModelUrl = "/models/lava.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Green Energy",
                Description = "An asteroid that was destroyed before, but is now full of life again.",
                Cost = 260,
                ColorHex = "#65D67C",
                ImageUrl = "/stars/garden.png",
                ModelUrl = "/models/garden.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Stylized Planet",
                Description = "Legend has it that a child of wind was born.",
                Cost = 300,
                ColorHex = "#35A98B",
                ImageUrl = "/stars/verdant.png",
                ModelUrl = "/models/stylized.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Purple Gas",
                Description = "Another purple light exposure planet.",
                Cost = 480,
                ColorHex = "#A78BFA",
                ImageUrl = "/stars/nebula.png",
                ModelUrl = "/models/purple-gas.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Cottage Planet",
                Description = "A whimsical cottage planet, impossibly cosy for something lost in deep space.",
                Cost = 620,
                ColorHex = "#D6A86E",
                ImageUrl = "/stars/hearth.png",
                ModelUrl = "/models/cottage-small.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Purple Planet",
                Description = "What??? Purple light exposure again???",
                Cost = 750,
                ColorHex = "#4A7FE8",
                ImageUrl = "/stars/sapphire.png",
                ModelUrl = "/models/purple.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Crystal",
                Description = "A glowing crystal world, bright, fragile, and strange.",
                Cost = 1000,
                ColorHex = "#7DEBFF",
                ImageUrl = "/stars/crystal.png",
                ModelUrl = "/models/crystal.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Uranium",
                Description = "A radioactive emerald world humming with unstable, forbidden energy.",
                Cost = 1250,
                ColorHex = "#B6F44A",
                ImageUrl = "/stars/uranium.png",
                ModelUrl = "/models/uranium.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Dusk",
                Description = "A forbbiden city, looks like it has iron revolution before.",
                Cost = 1450,
                ColorHex = "#7C8BA1",
                ImageUrl = "/stars/dusk.png",
                ModelUrl = "/models/dusk.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Solaris",
                Description = "A molten sun-crowned planet wrapped in flares and old gold heat.",
                Cost = 1700,
                ColorHex = "#F59E0B",
                ImageUrl = "/stars/solaris.png",
                ModelUrl = "/models/solar-crown.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Collapse",
                Description = "What remains after the light goes out. Few ever hold one.",
                Cost = 2000,
                ColorHex = "#8B5CF6",
                ImageUrl = "/stars/collapse.png",
                ModelUrl = "/models/transformers-_the_planet_cybertron.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Devourer",
                Description = "Anything that gets close to this planet will be swallowed up.",
                Cost = 3000,
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
