using Microsoft.EntityFrameworkCore;
using Orbit.Api.Models;

namespace Orbit.Api.Data;

public static class StoreSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.StarTypes.AnyAsync()) return;

        db.StarTypes.AddRange(
            new StarType
            {
                Name = "Ember",
                Description = "A small red dwarf. Steady, patient, long-burning.",
                Cost = 50,
                ColorHex = "#E8734A",
                ImageUrl = "/stars/ember.svg",
            },
            new StarType
            {
                Name = "Beacon",
                Description = "A yellow main-sequence star, bright enough to guide by.",
                Cost = 120,
                ColorHex = "#E8B93F",
                ImageUrl = "/stars/beacon.svg",
            },
            new StarType
            {
                Name = "Verdant",
                Description = "An unusual green-tinged giant. Rare and quietly strange.",
                Cost = 300,
                ColorHex = "#35A98B",
                ImageUrl = "/stars/verdant.svg",
            },
            new StarType
            {
                Name = "Sapphire",
                Description = "A blue supergiant burning fast and impossibly hot.",
                Cost = 750,
                ColorHex = "#4A7FE8",
                ImageUrl = "/stars/sapphire.svg",
            },
            new StarType
            {
                Name = "Collapse",
                Description = "What remains after the light goes out. Few ever hold one.",
                Cost = 2000,
                ColorHex = "#8B5CF6",
                ImageUrl = "/stars/collapse.svg",
            });

        await db.SaveChangesAsync();
    }
}