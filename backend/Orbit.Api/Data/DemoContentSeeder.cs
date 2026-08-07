using Microsoft.EntityFrameworkCore;
using Orbit.Api.Models;

namespace Orbit.Api.Data;

public static class DemoContentSeeder
{
    private const string SamplePassword = "orbit88888";

    public static async Task SeedAsync(AppDbContext db)
    {
        var users = new[]
        {
            new SeedUser("luna_quill", 420, 4, 7, 38),
            new SeedUser("starling", 360, 3, 5, 36),
            new SeedUser("ink_moon", 510, 5, 9, 34),
            new SeedUser("cobaltfox", 280, 2, 4, 32),
            new SeedUser("fernscribe", 640, 6, 10, 30),
            new SeedUser("ashwalker", 310, 3, 6, 28),
            new SeedUser("novarain", 455, 4, 8, 26),
            new SeedUser("solscribe", 720, 7, 12, 24),
            new SeedUser("mintdrift", 395, 3, 7, 22),
            new SeedUser("papercomet", 535, 5, 8, 20),
            new SeedUser("nightatlas", 860, 8, 14, 18),
            new SeedUser("rivertale", 475, 4, 9, 16),
        };

        foreach (var seed in users)
        {
            var existing = await db.Users.FirstOrDefaultAsync(u => u.Username == seed.Username);
            if (existing is null)
            {
                db.Users.Add(new User
                {
                    Username = seed.Username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(SamplePassword),
                    CreatedUtc = DaysAgo(seed.CreatedDaysAgo),
                    Energy = seed.Energy,
                    CurrentStreak = seed.CurrentStreak,
                    LongestStreak = seed.LongestStreak,
                    LastClaimUtc = DateTime.UtcNow.AddDays(-1),
                });
            }
            else
            {
                existing.Energy = Math.Max(existing.Energy, seed.Energy);
                existing.CurrentStreak = Math.Max(existing.CurrentStreak, seed.CurrentStreak);
                existing.LongestStreak = Math.Max(existing.LongestStreak, seed.LongestStreak);
            }
        }

        await db.SaveChangesAsync();

        var userByName = await db.Users.ToDictionaryAsync(u => u.Username);
        var starByName = await db.StarTypes.ToDictionaryAsync(s => s.Name);

        var planetAssignments = new Dictionary<string, string[]>
        {
            ["luna_quill"] = ["Purple Planet", "Green Energy"],
            ["starling"] = ["Allen Planet", "Stylized Planet"],
            ["ink_moon"] = ["Magma", "Purple Gas", "Dusk"],
            ["cobaltfox"] = ["Allen Planet"],
            ["fernscribe"] = ["Green Energy", "Cottage Planet"],
            ["ashwalker"] = ["Magma", "Dusk"],
            ["novarain"] = ["Purple Gas", "Uranium"],
            ["solscribe"] = ["Cottage Planet", "Solaris"],
            ["mintdrift"] = ["Stylized Planet", "Green Energy"],
            ["papercomet"] = ["Purple Planet", "Dusk"],
            ["nightatlas"] = ["Uranium", "Solaris", "Devourer"],
            ["rivertale"] = ["Allen Planet", "Cottage Planet", "Purple Planet"],
        };

        foreach (var (username, planetNames) in planetAssignments)
        {
            if (!userByName.TryGetValue(username, out var user)) continue;

            foreach (var planetName in planetNames)
            {
                if (!starByName.TryGetValue(planetName, out var star)) continue;

                var alreadyOwned = await db.OwnedStars
                    .AnyAsync(o => o.UserId == user.Id && o.StarTypeId == star.Id);
                if (alreadyOwned) continue;

                db.OwnedStars.Add(new OwnedStar
                {
                    UserId = user.Id,
                    StarTypeId = star.Id,
                    AcquiredUtc = DaysAgo(RandomishDay(username, planetName)),
                });
            }
        }

        await db.SaveChangesAsync();

        var posts = SeedPosts();

        foreach (var seed in posts)
        {
            if (!userByName.TryGetValue(seed.AuthorUsername, out var author)) continue;

            var existing = await db.Posts.FirstOrDefaultAsync(p => p.Title == seed.Title);
            if (existing is null)
            {
                db.Posts.Add(new Post
                {
                    Title = seed.Title,
                    Body = seed.Body.Trim(),
                    AuthorId = author.Id,
                    CreatedUtc = DaysAgo(seed.CreatedDaysAgo),
                });
            }
            else
            {
                existing.Body = seed.Body.Trim();
                existing.AuthorId = author.Id;
            }
        }

        await db.SaveChangesAsync();

        var postByTitle = await db.Posts.ToDictionaryAsync(p => p.Title);

        foreach (var seed in SeedComments())
        {
            if (!postByTitle.TryGetValue(seed.PostTitle, out var post)) continue;
            if (!userByName.TryGetValue(seed.AuthorUsername, out var author)) continue;

            var exists = await db.Comments.AnyAsync(c =>
                c.PostId == post.Id &&
                c.AuthorId == author.Id &&
                c.Body == seed.Body);
            if (exists) continue;

            db.Comments.Add(new Comment
            {
                PostId = post.Id,
                AuthorId = author.Id,
                Body = seed.Body,
                CreatedUtc = post.CreatedUtc.AddHours(seed.HoursAfterPost),
            });
        }

        var supportPool = users
            .Select(u => u.Username)
            .Concat(["demo", "demo2"])
            .Where(userByName.ContainsKey)
            .ToArray();

        for (var index = 0; index < posts.Length; index++)
        {
            var seed = posts[index];
            if (!postByTitle.TryGetValue(seed.Title, out var post)) continue;

            var supportTarget = 3 + index % 5;
            var supporterIndex = index * 3;
            var added = 0;

            while (added < supportTarget && added < supportPool.Length - 1)
            {
                var supporterName = supportPool[supporterIndex % supportPool.Length];
                supporterIndex++;

                if (supporterName == seed.AuthorUsername) continue;
                var supporter = userByName[supporterName];

                var exists = await db.Supports.AnyAsync(s =>
                    s.PostId == post.Id &&
                    s.UserId == supporter.Id);
                if (exists) continue;

                db.Supports.Add(new Support
                {
                    PostId = post.Id,
                    UserId = supporter.Id,
                    CreatedUtc = post.CreatedUtc.AddHours(1 + added),
                });
                added++;
            }
        }

        await db.SaveChangesAsync();
    }

    private static SeedPost[] SeedPosts() =>
    [
        new(
            "The planet that taught me to revise",
            "luna_quill",
            15,
            """
            I used to think revision meant fixing spelling after the real work was done. Then I bought a tiny purple planet and kept rotating it in the galaxy view while rereading an old draft. From one angle the planet looked soft, almost harmless; from another, it had all these bruised shadows I had ignored. That is what the draft was doing too. The first version had the plot, but not the weather. The second version had the feeling, but not the route through it. Revision became less like cleaning a room and more like walking around a strange moon until the door finally faced me.
            """),
        new(
            "A field guide to quiet feedback",
            "starling",
            14,
            """
            The best comments I receive are rarely dramatic. They are usually small lanterns: one sentence that says, “this part stayed with me,” or “I got lost right here.” I keep a list of those lines in a notebook because they show me where the story is breathing. Praise is lovely, but specific attention is better. It tells the writer the reader was not just passing through. On Orbit, I like the idea that energy is not only a number. It is proof that someone paused, looked closely, and handed a little light back.
            """),
        new(
            "I keep a notebook for unfinished skies",
            "ink_moon",
            13,
            """
            Some ideas are too thin to become stories right away, so I give them a place to wait. My notebook has pages called “weather that belongs to no plot,” “objects found on impossible planets,” and “sentences looking for a home.” The unfinished things are not failures. They are compost. A line about a staircase made of radio noise might sit for months before it becomes the first clue in a mystery. I used to rush these fragments because I wanted proof I was productive. Now I let them orbit until gravity appears.
            """),
        new(
            "When the forum feels like a campfire",
            "cobaltfox",
            12,
            """
            A good forum is not just a list of posts. It has temperature. You can tell when people are gathered around something because the replies stop sounding like announcements and start sounding like people leaning closer. I like threads where someone shares a half-finished thought and everyone treats it gently, not because it is perfect, but because it is alive. That is the feeling I want here: a campfire in deep space, with drafts instead of marshmallows and planets slowly turning in the dark behind us.
            """),
        new(
            "Green Energy and the patience of small gardens",
            "fernscribe",
            11,
            """
            The Green Energy planet is my favourite because it looks like it survived something. It does not feel shiny in the usual store-item way. It feels stubborn. I have drafts like that too: pieces I abandoned, reopened, cut back, and watched grow one good paragraph months later. Maybe that is why I like plant metaphors for writing. You cannot yell a seed into becoming a forest. You return, water, trim, wait, and sometimes the smallest leaf is enough evidence to keep going.
            """),
        new(
            "How I choose a title before the story exists",
            "ashwalker",
            10,
            """
            I know some writers title at the end, but I like choosing a title early because it gives the story a star to navigate by. The title is allowed to change, of course. It usually does. But even a temporary title creates a mood. “The Museum of Small Thunder” makes different promises than “Weather Report.” When I get stuck, I ask what the title thinks the story is about. Sometimes it answers with a scene. Sometimes it tells me I picked the wrong title and have been following the wrong constellation.
            """),
        new(
            "The strange comfort of daily streaks",
            "novarain",
            9,
            """
            I used to dislike streaks because they made creativity feel like homework. Lately I have changed my mind. A streak does not have to mean producing genius every day. It can mean opening the door. Some days the door leads to a chapter; some days it leads to one decent sentence and a sigh. Still, the ritual matters. The daily reward in Orbit works for me because it turns return into a small celebration. Not pressure. Just a little spark saying, “you came back.”
            """),
        new(
            "My cottage planet has too many windows",
            "solscribe",
            8,
            """
            The cottage planet is absurd in exactly the way I love. A whole village folded around a sphere, windows staring out into space like everyone forgot planets are supposed to be serious. It made me think about cozy science fiction, the kind where the wonder is not only in engines and disasters but in kitchens, porches, mugs, and neighbours. I want to write a story set there where the central conflict is not saving the universe, but finding who keeps stealing the moon-shaped biscuits from the bakery.
            """),
        new(
            "A letter to the reader who leaves one comment",
            "mintdrift",
            7,
            """
            Dear reader who leaves one comment: you may think it is a small thing, but it changes the room. A post without replies can feel like shouting into a helmet. One thoughtful response proves there is air outside. I have kept writing entire scenes because someone mentioned one image they liked. I have repaired confusing endings because someone admitted where they stumbled. You do not need to write an essay to help a writer. Sometimes one honest sentence is enough rope to pull the next paragraph out of the dark.
            """),
        new(
            "Writing sci-fi when the room is too loud",
            "papercomet",
            6,
            """
            My room is rarely quiet, so I have stopped waiting for perfect conditions. Instead I build small rituals that survive noise: headphones with rain sounds, a timer, one document, one sentence to begin. Science fiction helps because it gives the noise somewhere to go. A bus outside becomes a launch platform. The neighbour’s music becomes a festival on another moon. The trick is not escaping reality completely. The trick is smuggling reality into the story until the interruption becomes texture.
            """),
        new(
            "Dusk planet travel notes",
            "nightatlas",
            5,
            """
            If Dusk were a place you could visit, I think the guidebook would warn you not to trust the first sunset. The city looks abandoned from orbit, but lights keep turning on in the wrong buildings. Streets loop back to stations that have not operated for a century. The air tastes like iron and old rain. I would write the story as a travel diary where every practical note slowly becomes a confession. Entry one: bring a compass. Entry nine: the compass is lying. Entry twelve: so am I.
            """),
        new(
            "Why I buy planets instead of badges",
            "rivertale",
            4,
            """
            Badges are useful, but planets feel more personal. A badge says I did something. A planet says I am building a little mythology around the work. When I buy a planet with energy earned from posts and comments, the profile starts to look like a map of attention. This one came from a draft people supported. That one came from a week of daily returns. The collection is not just decoration; it is a record of being present long enough for small things to accumulate.
            """),
        new(
            "The support button is a tiny lighthouse",
            "luna_quill",
            3,
            """
            I like support systems that do not pretend to solve everything. A button cannot replace careful critique or friendship or the slow private work of improving. But it can still matter. It can say, “I saw this.” It can make the hottest filter feel earned. It can give a writer enough energy to buy a ridiculous planet and smile at their own profile. That is not nothing. In a web full of loud metrics, a tiny lighthouse is still a lighthouse.
            """),
        new(
            "I tried to describe Uranium without saying green",
            "starling",
            2,
            """
            I failed immediately, obviously. But the attempt was useful. Instead of “green,” I wrote: bottle-glass light, storm-lit moss, the glow under a scanner, old copper waking up. Trying not to use the obvious word pushed me toward a better palette. I do this with emotions too. If I ban myself from “sad,” I have to find the actual shape: hollow, over-bright, slow, brittle, underwater. Constraints are annoying until they open a window you did not know was painted shut.
            """),
        new(
            "Magma as a mood, not a monster",
            "ink_moon",
            1,
            """
            The Magma planet looks violent at first, but I keep thinking about pressure rather than destruction. Heat trapped under a surface. A world pretending to be solid while something bright moves underneath. That is a good metaphor for characters who seem calm until the scene finally gives them permission to crack. I do not want to write Magma as an enemy planet. I want to write it as a diary with a crust: dangerous, yes, but only because it has been holding too much for too long.
            """),
        new(
            "What makes a profile feel inhabited",
            "cobaltfox",
            1,
            """
            A profile feels inhabited when it has evidence of choices. Not just a username and a number, but traces: posts, comments, planets, an avatar, tiny signs that a person returned more than once. I think that is why the galaxy page works as an idea. It gives the profile a room with furniture. Maybe the next step is letting people arrange their planets, but even without that, ownership makes the space feel less like a template and more like a shelf someone actually uses.
            """),
        new(
            "A soft rule for editing old drafts",
            "fernscribe",
            1,
            """
            My rule is this: before cutting anything from an old draft, write down what the draft was trying to become. Not what it failed to be. What it wanted. That one sentence keeps me from editing with contempt. Sometimes a messy paragraph is protecting the original impulse, and if I delete it too quickly I lose the pulse with the clutter. A soft rule does not stop me from being ruthless. It just reminds me that even bad drafts arrived carrying a gift.
            """),
        new(
            "Solaris and the danger of too much glow",
            "ashwalker",
            1,
            """
            Solaris is beautiful because it is almost too much. That is also the problem with some prose. A sentence can glow so hard it blinds the scene around it. I have a bad habit of keeping flashy lines long after they stop serving the story. The planet reminded me that brightness needs shadow to become shape. Now when a paragraph feels overlit, I ask what darkness would make it visible. Usually the answer is simpler verbs, less explanation, and one image allowed to breathe.
            """),
    ];

    private static SeedComment[] SeedComments() =>
    [
        new("The planet that taught me to revise", "starling", "This is such a good way to explain revision. The rotating-planet comparison makes the work feel less scary.", 2),
        new("The planet that taught me to revise", "fernscribe", "I love the phrase “not cleaning a room, walking around a strange moon.” That is exactly the energy revision needs.", 5),
        new("A field guide to quiet feedback", "luna_quill", "Specific attention really is the best gift. I might borrow the lantern metaphor for my next forum reply.", 2),
        new("A field guide to quiet feedback", "mintdrift", "This made me want a saved-comments page someday. Little feedback lanterns deserve a shelf.", 6),
        new("I keep a notebook for unfinished skies", "papercomet", "The fragment categories are delightful. “Weather that belongs to no plot” sounds like a whole collection.", 3),
        new("I keep a notebook for unfinished skies", "nightatlas", "Compost is the right word. Old fragments always look useless until suddenly they are soil.", 7),
        new("When the forum feels like a campfire", "rivertale", "A campfire in deep space is basically the perfect description of what this app is trying to be.", 4),
        new("When the forum feels like a campfire", "novarain", "This convinced me to comment more often instead of silently reading and disappearing like a ghost.", 9),
        new("Green Energy and the patience of small gardens", "solscribe", "The store planet matching the writing process is so satisfying here. Stubborn little leaf energy.", 3),
        new("Green Energy and the patience of small gardens", "ashwalker", "I needed the reminder that you cannot yell a seed into a forest. Painfully accurate.", 8),
        new("How I choose a title before the story exists", "cobaltfox", "Temporary titles are underrated. Mine are usually terrible, but they still point the draft somewhere.", 2),
        new("How I choose a title before the story exists", "ink_moon", "“What does the title think the story is about?” is going straight into my drafting notes.", 6),
        new("The strange comfort of daily streaks", "luna_quill", "Opening the door is a softer goal than producing genius. I can actually live with that.", 2),
        new("The strange comfort of daily streaks", "papercomet", "This made the daily reward mechanic feel connected to the writing theme, not just gamification.", 5),
        new("My cottage planet has too many windows", "mintdrift", "Please write the moon-biscuit bakery mystery. I would read an unreasonable number of chapters.", 4),
        new("My cottage planet has too many windows", "fernscribe", "Cozy sci-fi needs more respect. Not every spaceship has to explode to matter.", 7),
        new("A letter to the reader who leaves one comment", "starling", "This is the post I want every quiet reader to find. One sentence can do a lot.", 2),
        new("A letter to the reader who leaves one comment", "rivertale", "The helmet image is painfully real. Comments really do put air back in the room.", 5),
        new("Writing sci-fi when the room is too loud", "novarain", "Turning interruptions into texture is a powerful move. I usually just get annoyed and lose the scene.", 3),
        new("Writing sci-fi when the room is too loud", "ashwalker", "The bus becoming a launch platform is such a neat example of stealing from reality.", 6),
        new("Dusk planet travel notes", "cobaltfox", "Entry twelve gave me chills. This absolutely wants to become a full story.", 2),
        new("Dusk planet travel notes", "luna_quill", "A travel diary slowly becoming a confession is a gorgeous structure. Please keep going.", 5),
        new("Why I buy planets instead of badges", "nightatlas", "“A map of attention” is the line. That is exactly why collectibles feel good here.", 3),
        new("Why I buy planets instead of badges", "solscribe", "This makes profiles feel less like stats and more like tiny museums. I am into it.", 7),
        new("The support button is a tiny lighthouse", "mintdrift", "Tiny lighthouse is perfect. Small UI, big emotional signal.", 2),
        new("The support button is a tiny lighthouse", "starling", "I like that this does not overclaim what support can do. It just gives it a human scale.", 4),
        new("I tried to describe Uranium without saying green", "ink_moon", "Bottle-glass light is so good. Constraint exercises always make colour more interesting.", 3),
        new("I tried to describe Uranium without saying green", "fernscribe", "The emotion version of this exercise is brutal and useful. Banning “sad” changes everything.", 6),
        new("Magma as a mood, not a monster", "ashwalker", "A diary with a crust is wildly good. That image is going to stick.", 2),
        new("Magma as a mood, not a monster", "nightatlas", "Pressure instead of destruction makes the planet feel much more narratively interesting.", 4),
        new("What makes a profile feel inhabited", "rivertale", "Yes to profiles needing traces. Empty profile pages always feel like unopened apartments.", 3),
        new("What makes a profile feel inhabited", "solscribe", "Arranging planets would be such a good future feature. Tiny personal galaxy curation.", 6),
        new("A soft rule for editing old drafts", "papercomet", "Editing with contempt is a real danger. I like the idea of asking what the draft wanted first.", 2),
        new("A soft rule for editing old drafts", "novarain", "This is gentle but not precious. That balance is hard to explain and you nailed it.", 5),
        new("Solaris and the danger of too much glow", "luna_quill", "The idea that brightness needs shadow to become shape is useful beyond prose too.", 2),
        new("Solaris and the danger of too much glow", "cobaltfox", "I am guilty of keeping shiny sentences that do nothing. Solaris has personally attacked me.", 4),
    ];

    private static DateTime DaysAgo(int daysAgo) =>
        DateTime.UtcNow.Date.AddDays(-daysAgo).AddHours(8);

    private static int RandomishDay(string username, string planetName) =>
        Math.Abs(HashCode.Combine(username, planetName)) % 20 + 1;

    private sealed record SeedUser(
        string Username,
        int Energy,
        int CurrentStreak,
        int LongestStreak,
        int CreatedDaysAgo);

    private sealed record SeedPost(
        string Title,
        string AuthorUsername,
        int CreatedDaysAgo,
        string Body);

    private sealed record SeedComment(
        string PostTitle,
        string AuthorUsername,
        string Body,
        int HoursAfterPost);
}
