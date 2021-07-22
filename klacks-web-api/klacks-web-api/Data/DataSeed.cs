

using klacks_web_api.Models.Authentfication;
using klacks_web_api.Models.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;

namespace klacks_web_api.Data
{
  public class DataSeed
  {
    public DataSeed(ModelBuilder modelBuilder)
    {
      AppUser appAdmin = new AppUser
      {
        UserName = "admin",
        Email = "admin@test.com",
        NormalizedEmail = "admin@test.com".ToUpper(),
        NormalizedUserName = "admin".ToUpper(),
        TwoFactorEnabled = false,
        EmailConfirmed = true,
        PhoneNumber = "123456789",
        PhoneNumberConfirmed = false,
        FirstName = "admin",
        LastName = "admin",
      };

      IdentityRole appRoleAdmin = new IdentityRole { Name = "Admin", NormalizedName = "ADMIN" };
      IdentityRole appRoleAuthorised = new IdentityRole { Name = "Authorised", NormalizedName = "AUTHORISED" };

      PasswordHasher<AppUser> ph = new PasswordHasher<AppUser>();
      appAdmin.PasswordHash = ph.HashPassword(appAdmin, "P@ssw0rt1");

      modelBuilder.Entity<AppUser>().HasData(
         appAdmin
     );


      modelBuilder.Entity<IdentityRole>().HasData(
          appRoleAdmin,
         appRoleAuthorised
      );

      modelBuilder.Entity<IdentityUserRole<string>>().HasData(
        new IdentityUserRole<string>
        {
          RoleId = appRoleAdmin.Id,
          UserId = appAdmin.Id
        });

      modelBuilder.Entity<IdentityUserRole<string>>().HasData(
        new IdentityUserRole<string>
        {
          RoleId = appRoleAuthorised.Id,
          UserId = appAdmin.Id
        });

      var comTypeFp = new
      {
        Id = 1,
        Name = "Festnetz P",
        Type = 0,
        Category = 0,
        DefaultIndex = 0,
      };

      var comTypeMp = new
      {
        Id = 2,
        Name = "Mobil P",
        Type = 1,
        Category = 0,
        DefaultIndex = 1,
      };

      var comTypeFg = new
      {
        Id = 3,
        Name = "Festnetz G",
        Type = 2,
        Category = 0,
        DefaultIndex = 0,
      };

      var comTypeMg = new
      {
        Id = 4,
        Name = "Mobil G",
        Type = 3,
        Category = 0,
        DefaultIndex = 0,
      };

      var comTypeEm = new
      {
        Id = 5,
        Name = "NotfallNo",
        Type = 7,
        Category = 0,
        DefaultIndex = 0,
      };

      var comTypeEp = new
      {
        Id = 6,
        Name = "Email P",
        Type = 4,
        Category = 1,
        DefaultIndex = 2,
      };

      var comTypeEg = new
      {
        Id = 7,
        Name = "Email G",
        Type = 5,
        Category = 1,
        DefaultIndex = 0,
      };

      var comTypeA = new
      {
        Id = 8,
        Name = "Anderes",
        Type = 6,
        Category = 0,
        DefaultIndex = 0,
      };

      modelBuilder.Entity<CommunicationType>().HasData(
         comTypeFp
      );
      modelBuilder.Entity<CommunicationType>().HasData(
        comTypeMp
      );
      modelBuilder.Entity<CommunicationType>().HasData(
        comTypeFg
      );
      modelBuilder.Entity<CommunicationType>().HasData(
        comTypeMg
      );
      modelBuilder.Entity<CommunicationType>().HasData(
        comTypeEm
      );
      modelBuilder.Entity<CommunicationType>().HasData(
        comTypeEp
      );
      modelBuilder.Entity<CommunicationType>().HasData(
        comTypeEg
      );
      modelBuilder.Entity<CommunicationType>().HasData(
        comTypeA
      );

      modelBuilder.Entity<Countries>().HasData(
       new Countries()
       {
         Id = new Guid("478fc46a-85c4-41f3-8985-6d8f528dd17d"),
         Name = "Schweiz",
         Abbreviation = "CH",
         Prefix = "+41",
       }
     );

      modelBuilder.Entity<Countries>().HasData(
        new Countries()
        {
          Id = new Guid("e963789a-31ce-4c21-bfb4-698a2845046c"),
          Name = "Deutschland",
          Abbreviation = "D",
          Prefix = "+49",
        }
      );

      modelBuilder.Entity<Countries>().HasData(
        new Countries()
        {
          Id = new Guid("dc26799a-b160-4f60-abc8-5ec04c6f0971"),
          Name = "Frankreich",
          Abbreviation = "D",
          Prefix = "+33",
        }
      );

      modelBuilder.Entity<Countries>().HasData(
        new Countries()
        {
          Id = new Guid("1fbde674-b24e-485b-abca-7ab09fae0d3f"),
          Name = "Italien",
          Abbreviation = "I",
          Prefix = "+39",
        }
      );

      modelBuilder.Entity<Countries>().HasData(
        new Countries()
        {
          Id = new Guid("28dc4260-5556-4c4a-ad0b-d818f2a9d39c"),
          Name = "Österreich",
          Abbreviation = "A",
          Prefix = "+43",
        }
      );

      modelBuilder.Entity<Countries>().HasData(
        new Countries()
        {
          Id = new Guid("b5b60df5-b8f8-4132-8b4c-6c1290942b83"),
          Name = "Fürstentum Liechtenstein",
          Abbreviation = "LI",
          Prefix = "+423",
        }
      );

    }
  }
}
