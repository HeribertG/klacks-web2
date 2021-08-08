using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace klacks_web_api.Migrations
{
    public partial class abscence : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "absence_reason",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    abbreviation = table.Column<string>(type: "text", nullable: true),
                    background_color = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    defaultlenght = table.Column<int>(type: "integer", nullable: false),
                    default_value = table.Column<decimal>(type: "numeric", nullable: false),
                    with_saturday = table.Column<bool>(type: "boolean", nullable: false),
                    with_sunday = table.Column<bool>(type: "boolean", nullable: false),
                    with_holiday = table.Column<bool>(type: "boolean", nullable: false),
                    is_work = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_absence_reason", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "absence",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    employee_id = table.Column<Guid>(type: "uuid", nullable: false),
                    absence_reason_id = table.Column<Guid>(type: "uuid", nullable: false),
                    begin_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    end_date = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    create_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    current_user_created = table.Column<string>(type: "text", nullable: true),
                    update_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    current_user_updated = table.Column<string>(type: "text", nullable: true),
                    deleted_time = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    is_deleted = table.Column<bool>(type: "boolean", nullable: false),
                    current_user_deleted = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_absence", x => x.id);
                    table.ForeignKey(
                        name: "fk_absence_absence_reason_absence_reason_id",
                        column: x => x.absence_reason_id,
                        principalTable: "absence_reason",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_absence_employee_employee_id",
                        column: x => x.employee_id,
                        principalTable: "employee",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_absence_absence_reason_id",
                table: "absence",
                column: "absence_reason_id");

            migrationBuilder.CreateIndex(
                name: "ix_absence_employee_id_absence_reason_id_begin_date_end_date",
                table: "absence",
                columns: new[] { "employee_id", "absence_reason_id", "begin_date", "end_date" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "absence");

            migrationBuilder.DropTable(
                name: "absence_reason");
        }
    }
}
