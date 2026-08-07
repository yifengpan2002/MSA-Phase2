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
                Name = "Ember",
                Description = "A small red dwarf. Steady, patient, long-burning.",
                Cost = 50,
                ColorHex = "#E8734A",
                ImageUrl = "/stars/ember.png",
                ModelUrl = "/models/alien.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Beacon",
                Description = "A yellow main-sequence star, bright enough to guide by.",
                Cost = 120,
                ColorHex = "#E8B93F",
                ImageUrl = "/stars/beacon.png",
                ModelUrl = "/models/planet.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Magma",
                Description = "A lava-hearted world with cooled crust and cracks that still remember fire.",
                Cost = 180,
                ColorHex = "#F97316",
                ImageUrl = "/stars/magma.png",
                ModelUrl = "/models/lava.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Garden",
                Description = "A tiny wild planet where green light keeps growing over every ridge.",
                Cost = 260,
                ColorHex = "#65D67C",
                ImageUrl = "/stars/garden.png",
                ModelUrl = "/models/garden.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Verdant",
                Description = "An unusual green-tinged giant. Rare and quietly strange.",
                Cost = 300,
                ColorHex = "#35A98B",
                ImageUrl = "/stars/verdant.png",
                ModelUrl = "/models/stylized.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Nebula",
                Description = "A purple gas giant with soft storms drifting under a velvet atmosphere.",
                Cost = 480,
                ColorHex = "#A78BFA",
                ImageUrl = "/stars/nebula.png",
                ModelUrl = "/models/purple-gas.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Hearth",
                Description = "A whimsical cottage planet, impossibly cosy for something lost in deep space.",
                Cost = 620,
                ColorHex = "#D6A86E",
                ImageUrl = "/stars/hearth.png",
                ModelUrl = "/models/cottage.glb",
                ModelScale = 1.0,
            },
            new StarType
            {
                Name = "Sapphire",
                Description = "A blue supergiant burning fast and impossibly hot.",
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
                Description = "A shadowed realistic planet with heavy clouds and weather no telescope can settle.",
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
                Description = "A colossal hunter planet with a red eye, metal teeth, and absolutely no manners.",
                Cost = 3000,
                ColorHex = "#EF4444",
                ImageUrl = "/stars/devourer.png",
                ModelUrl = "/models/devourer.glb",
                ModelScale = 1.0,
            },
        };

        foreach (var seed in starTypes)
        {
            var existing = await db.StarTypes.FirstOrDefaultAsync(s => s.Name == seed.Name);

            if (existing is null)
            {
                db.StarTypes.Add(seed);
                continue;
            }

            existing.Description = seed.Description;
            existing.Cost = seed.Cost;
            existing.ImageUrl = seed.ImageUrl;
            existing.ColorHex = seed.ColorHex;
            existing.ModelUrl = seed.ModelUrl;
            existing.ModelScale = seed.ModelScale;
        }

        await db.SaveChangesAsync();
    }
}
