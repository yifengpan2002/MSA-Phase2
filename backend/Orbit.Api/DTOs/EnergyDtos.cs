namespace Orbit.Api.Dtos;

public record DailyStatusResponse(
    bool CanClaimToday,
    int CurrentStreak,
    int LongestStreak,
    int NextReward,
    int Energy,
    DateTime? LastClaimUtc
);

public record ClaimResponse(
    int EnergyAwarded,
    int CurrentStreak,
    int LongestStreak,
    int Energy,
    bool StreakReset
);

public record StarTypeResponse(
    Guid Id,
    string Name,
    string Description,
    int Cost,
    string ImageUrl,
    string ColorHex,
    int OwnedCount
);

public record PurchaseResponse(int Energy, int OwnedCount);

public record SupportResponse(int EnergyCount, bool SupportedByMe);