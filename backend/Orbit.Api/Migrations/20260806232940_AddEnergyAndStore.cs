using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Orbit.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddEnergyAndStore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrentStreak",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Energy",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastClaimUtc",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LongestStreak",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StarTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 60, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Cost = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", maxLength: 300, nullable: false),
                    ColorHex = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StarTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OwnedStars",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    StarTypeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AcquiredUtc = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnedStars", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OwnedStars_StarTypes_StarTypeId",
                        column: x => x.StarTypeId,
                        principalTable: "StarTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OwnedStars_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OwnedStars_StarTypeId",
                table: "OwnedStars",
                column: "StarTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_OwnedStars_UserId",
                table: "OwnedStars",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OwnedStars");

            migrationBuilder.DropTable(
                name: "StarTypes");

            migrationBuilder.DropColumn(
                name: "CurrentStreak",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Energy",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastClaimUtc",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LongestStreak",
                table: "Users");
        }
    }
}
