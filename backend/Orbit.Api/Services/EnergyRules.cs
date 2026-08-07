
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Orbit.Api.Data;
using Orbit.Api.Dtos;
using Orbit.Api.Extensions;
using Orbit.Api.Models;
using Orbit.Api.Services;

public static class EnergyRules
{
    public const int BaseDailyReward = 25;
    public const int MaxDailyReward = 250;
    public const int SupportReward = 50;

    /// <summary>
    /// Doubles each consecutive day, capped so long streaks stay balanced.
    /// Day 1: 25, day 2: 50, day 3: 100, day 4: 200, day 5+: 250.
    /// </summary>
    public static int DailyReward(int streakDay)
    {
        if (streakDay < 1) streakDay = 1;
        if (streakDay >= 6) return MaxDailyReward;

        var reward = BaseDailyReward * (int)Math.Pow(2, streakDay - 1);
        return Math.Min(reward, MaxDailyReward);
    }
}
