using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoList.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TaskPriority",
                table: "Tasks",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TaskPriority",
                table: "Tasks");
        }
    }
}
