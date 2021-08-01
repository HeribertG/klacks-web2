using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace klacks_web_api.Migrations
{
    public partial class options : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "employee_status_id",
                table: "staff",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "civil_status_id",
                table: "employee",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "civil_status",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    position = table.Column<int>(type: "integer", nullable: false),
                    is_default = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_civil_status", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "employee_status",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    position = table.Column<int>(type: "integer", nullable: false),
                    is_default = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_employee_status", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_staff_employee_status_id",
                table: "staff",
                column: "employee_status_id");

            migrationBuilder.CreateIndex(
                name: "ix_employee_civil_status_id",
                table: "employee",
                column: "civil_status_id");

            migrationBuilder.AddForeignKey(
                name: "fk_employee_civil_status_civil_status_id",
                table: "employee",
                column: "civil_status_id",
                principalTable: "civil_status",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_staff_employee_status_employee_status_id",
                table: "staff",
                column: "employee_status_id",
                principalTable: "employee_status",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_employee_civil_status_civil_status_id",
                table: "employee");

            migrationBuilder.DropForeignKey(
                name: "fk_staff_employee_status_employee_status_id",
                table: "staff");

            migrationBuilder.DropTable(
                name: "civil_status");

            migrationBuilder.DropTable(
                name: "employee_status");

            migrationBuilder.DropIndex(
                name: "ix_staff_employee_status_id",
                table: "staff");

            migrationBuilder.DropIndex(
                name: "ix_employee_civil_status_id",
                table: "employee");

            migrationBuilder.DropColumn(
                name: "employee_status_id",
                table: "staff");

            migrationBuilder.DropColumn(
                name: "civil_status_id",
                table: "employee");
        }
    }
}
