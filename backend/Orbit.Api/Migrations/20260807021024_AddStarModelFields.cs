using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Orbit.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStarModelFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "ModelScale",
                table: "StarTypes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "ModelUrl",
                table: "StarTypes",
                type: "TEXT",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModelScale",
                table: "StarTypes");

            migrationBuilder.DropColumn(
                name: "ModelUrl",
                table: "StarTypes");
        }
    }
}
