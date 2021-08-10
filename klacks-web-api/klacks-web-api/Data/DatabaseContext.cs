using klacks_web_api.Models;
using klacks_web_api.Models.Authentfication;
using klacks_web_api.Models.Calendar;
using klacks_web_api.Models.Corporation;
using klacks_web_api.Models.Employee;
using klacks_web_api.Models.Options;
using klacks_web_api.Models.Setting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace klacks_web_api.Data
{
  public class DatabaseContext : IdentityDbContext
  {
    private readonly IHttpContextAccessor httpContextAccessor;


    public DatabaseContext(DbContextOptions<DatabaseContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
    {
      this.httpContextAccessor = httpContextAccessor;
    }

    public DbSet<Employee> Employee { get; set; }
    public DbSet<Address> Address { get; set; }
    public DbSet<Communication> Communication { get; set; }
    public DbSet<Annotation> Annotation { get; set; }
    public DbSet<Staff> Staff { get; set; }
    public DbSet<CommunicationType> CommunicationType { get; set; }
    public DbSet<PostcodeCH> PostcodeCH { get; set; }
    public DbSet<Countries> Countries { get; set; }
    public DbSet<AppUser> AppUser { get; set; }
    public DbSet<RefreshToken> RefreshToken { get; set; }
    public DbSet<Settings> Settings { get; set; }
    public DbSet<Image.Image> Image { get; set; }
    public DbSet<EmployeeStatus> EmployeeStatus { get; set; }
    public DbSet<CivilStatus> CivilStatus { get; set; }
    public DbSet<HolydayRule> HolydayRule { get; set; }
    public DbSet<Absence> Absence { get; set; }
    public DbSet<AbsenceReason> AbsenceReason { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
      optionsBuilder.LogTo(Console.WriteLine,Microsoft.Extensions.Logging.LogLevel.Information);
      optionsBuilder.UseSnakeCaseNamingConvention();
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);


      modelBuilder.Entity<Employee>().HasQueryFilter(p => !p.IsDeleted);
      modelBuilder.Entity<Address>().HasQueryFilter(p => !p.IsDeleted);
      modelBuilder.Entity<Communication>().HasQueryFilter(p => !p.IsDeleted);
      modelBuilder.Entity<Staff>().HasQueryFilter(p => !p.IsDeleted);
      modelBuilder.Entity<Annotation>().HasQueryFilter(p => !p.IsDeleted);
      modelBuilder.Entity<Image.Image>().HasQueryFilter(p => !p.IsDeleted);
      modelBuilder.Entity<Absence>().HasQueryFilter(p => !p.IsDeleted);

      modelBuilder.Entity<Employee>().HasIndex(p => new { p.FirstName, p.SecondName, p.Name, p.MaidenName, p.Gender, p.IsDeleted });
      modelBuilder.Entity<Address>().HasIndex(p => new { p.Street, p.Street2, p.Street3, p.City, p.IsDeleted });
      modelBuilder.Entity<Communication>().HasIndex(p => new { p.Value, p.IsDeleted });
      modelBuilder.Entity<Staff>().HasIndex(p => new { p.ValidFrom, p.ValidUntil, p.IsDeleted });
      modelBuilder.Entity<Image.Image>().HasIndex(p => new { p.IsDeleted });
      modelBuilder.Entity<Absence>().HasIndex(p => new { p.EmployeeId, p.AbsenceReasonId, p.BeginDate, p.EndDate });



      modelBuilder.Entity<Address>()
         .HasOne(p => p.Employee)
         .WithMany(b => b.Addresses);

      modelBuilder.Entity<Communication>()
       .HasOne(p => p.Employee)
       .WithMany(b => b.Communications);

      modelBuilder.Entity<Staff>()
        .HasOne(p => p.Employee)
        .WithOne(b => b.Staff);

      modelBuilder.Entity<Staff>()
      .HasOne(p => p.EmployeeStatus);

      modelBuilder.Entity<Employee>()
     .HasOne(p => p.CivilStatus);

      modelBuilder.Entity<Absence>()
      .HasOne(p => p.Employee);
      modelBuilder.Entity<Absence>()
    .HasOne(p => p.AbsenceReason);

      //new DataSeed(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = new CancellationToken())
    {
      OnBeforeSaving();
      return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
      OnBeforeSaving();
      return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
      OnBeforeSaving();
      return base.SaveChanges();
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
      OnBeforeSaving();
      return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    private void OnBeforeSaving()
    {
      var entries = ChangeTracker.Entries();
      foreach (var entry in entries)
      {
        if (!(entry.Entity is BaseEntity entityBase)) continue;


        var now = DateTime.UtcNow;
        var currentUserName = "Anonymous";
        try
        {
          if (httpContextAccessor.HttpContext != null)
          {
            if (httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier) != null)
            {
              currentUserName = !string.IsNullOrEmpty(httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier).Value) ? httpContextAccessor.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier).Value : "Anonymous";

            }

          }
        }
        catch (Exception ex)
        {
          Console.WriteLine(ex.Message);
        }


        switch (entry.State)
        {
          case EntityState.Deleted:
            entry.State = EntityState.Modified;
            entityBase.DeletedTime = now;
            entityBase.IsDeleted = true;
            entityBase.CurrentUserDeleted = currentUserName;
            break;

          case EntityState.Added:
            entityBase.CreateTime = now;
            entityBase.CurrentUserCreated = currentUserName;
            break;

          case EntityState.Modified:
            entityBase.UpdateTime = now;
            entityBase.CurrentUserUpdated = currentUserName;
            break;
        }
      }
    }

  }
}
