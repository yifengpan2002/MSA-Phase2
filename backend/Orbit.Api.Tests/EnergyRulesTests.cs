using Xunit;

namespace Orbit.Api.Tests;

public class EnergyRulesTests
{
    [Theory]
    [InlineData(1, 25)]
    [InlineData(2, 50)]
    [InlineData(3, 100)]
    [InlineData(4, 200)]
    [InlineData(5, 250)]
    [InlineData(6, 250)]
    [InlineData(10, 250)]
    public void DailyReward_DoublesUntilItReachesTheCap(int streakDay, int expectedReward)
    {
        var reward = EnergyRules.DailyReward(streakDay);

        Assert.Equal(expectedReward, reward);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-3)]
    public void DailyReward_TreatsInvalidStreakDaysAsDayOne(int streakDay)
    {
        var reward = EnergyRules.DailyReward(streakDay);

        Assert.Equal(EnergyRules.BaseDailyReward, reward);
    }

    [Fact]
    public void SupportReward_IsFiftyEnergy()
    {
        Assert.Equal(50, EnergyRules.SupportReward);
    }
}
