using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using jsreport.AspNetCore;
using jsreport.Client;
using klacks_web_api.Data;
using klacks_web_api.Models.Authentfication;
using System.Linq;
using FluentValidation.AspNetCore;
using klacks_web_api.Repository;
using klacks_web_api.Interface;
using AutoMapper;
using AutoMapper.EquivalencyExpression;


namespace klacks_web_api
{
  public class Startup
  {

    public static DbContextOptionsBuilder<DatabaseContext> DatabaseContextOptionsBuilder;
    public static ILoggerFactory LoggerFactory;

    public IConfiguration Configuration { get; }

    private static readonly string[] Headers = new[] { "X-Operation", "X-Resource", "X-Total-Count" };

    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }


    
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddSignalR();
      services.AddControllers().AddNewtonsoftJson();

      services.AddIdentity<AppUser, IdentityRole>()
          .AddEntityFrameworkStores<DatabaseContext>();

      services.AddMvc(option => option.EnableEndpointRouting = false)
          .AddNewtonsoftJson(options =>
          {
            options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
          })
         .AddFluentValidation();

      services.AddAutoMapper((serviceProvider, automapper) => { automapper.AddCollectionMappers(); automapper.UseEntityFrameworkCoreModel<DatabaseContext>(serviceProvider); }, typeof(Startup));


      services.AddScoped<IUnitOfWork, UnitOfWork>();
      services.AddScoped<IEmployeeRepository, EmployeeRepository>();
      services.AddScoped<IAddressRepository, AddressRepository>();
      services.AddScoped<IAnnotationRepository, AnnotationRepository>();
      services.AddScoped<ICommunicationRepository, CommunicationRepository>();
      services.AddScoped<IStaffRepository, StaffRepository>();



      var connectionString = Configuration.GetConnectionString("Default"); 

      services.AddDbContext<DatabaseContext>(options => options.UseNpgsql(connectionString ?? throw new InvalidOperationException()));







      var reportApi = Configuration.GetValue<string>("Jsreport:JsreportApiUrl");
      services.AddJsReport(new ReportingService(reportApi));


      var jwtSettings = new JwtSettings();
      Configuration.Bind(nameof(jwtSettings), jwtSettings);
      services.AddSingleton(jwtSettings);

      services.AddAuthentication(x =>
      {
        x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
      })
          .AddJwtBearer(x =>
          {
            x.SaveToken = true;
            x.TokenValidationParameters = new TokenValidationParameters
            {
              ValidateIssuerSigningKey = true,
              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
              ValidateIssuer = false,
              ValidateAudience = false,
              RequireExpirationTime = false,
              ValidateLifetime = true
            };
          });

      // RegisterUser the Swagger generator, defining 1 or more Swagger documents
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new Info
        {
          Title = "klacks-web-api",
          Version = "v1",
          Description = "klacks-web-api with ASP.NET Core 3.1, powered by hgasparoli@hotmail.com",
        });
        // Bearer token authentication
        OpenApiSecurityScheme securityDefinition = new OpenApiSecurityScheme()
        {
          Name = "Bearer",
          BearerFormat = "JWT",
          Scheme = "bearer",
          Description = "Specify the authorization token.",
          In = ParameterLocation.Header,
          Type = SecuritySchemeType.Http,
        };



        c.AddSecurityDefinition("jwt_auth", securityDefinition);

        // Make sure swagger UI requires a Bearer token specified
        OpenApiSecurityScheme securityScheme = new OpenApiSecurityScheme()
        {
          Reference = new OpenApiReference()
          {
            Id = "jwt_auth",
            Type = ReferenceType.SecurityScheme,

          }
        };
        OpenApiSecurityRequirement securityRequirements = new OpenApiSecurityRequirement()
              {
                        {securityScheme, new string[] { }},
              };
        c.AddSecurityRequirement(securityRequirements);
      });

      // AllowCredentials ist wegen signalR wichtig, deswegen cors.WithOrigins(...) und nicht cors.AllowAnyOrigins() 
      services.AddCors(options =>
      {
        options.AddPolicy("CorsPolicy", cors =>
              cors.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders(Headers)
              .AllowCredentials()
              );
      });

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory iLoggerFactory)
    {
      LoggerFactory = iLoggerFactory;
      Console.WriteLine("UpdateDatabase start");
      UpdateDatabase(app);
      Console.WriteLine("UpdateDatabase done");

      Console.WriteLine("{0}", new Version().Get(true));

      if (env.IsDevelopment())
      {
        app.UseExceptionHandler("/Home/Error");
      }
      else
      {
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }


      app.UseCors("CorsPolicy");

      // Enable middleware to serve generated Swagger as a JSON endpoint.
      app.UseSwagger();

      // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
      // specifying the Swagger JSON endpoint.
      app.UseSwaggerUI(c =>
      {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "klacks-web-api V1");
      });

      app.UseAuthentication();

      app.UseHttpsRedirection();
      app.UseMvc();

      app.UseHttpsRedirection();

      app.UseRouting();
      app.UseDefaultFiles();
      app.UseStaticFiles();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapFallbackToFile("/index.html");
        endpoints.MapControllers();
        // endpoints.MapHub<PrintHub>("/api/backend/message");

      });
    }

    private void UpdateDatabase(IApplicationBuilder app)
    {

      string connectionString = Configuration["CONNECTIONSTRING"];
      if (string.IsNullOrEmpty(connectionString)) { connectionString = Configuration.GetConnectionString("Default"); }
      DatabaseContextOptionsBuilder = new DbContextOptionsBuilder<DatabaseContext>();
      DatabaseContextOptionsBuilder.UseNpgsql(connectionString);
      DatabaseContextOptionsBuilder.EnableDetailedErrors();
      DatabaseContextOptionsBuilder.EnableSensitiveDataLogging();
      DatabaseContextOptionsBuilder.UseLoggerFactory(LoggerFactory);

      using var context = new DatabaseContext(DatabaseContextOptionsBuilder.Options, null);
      var pendingMigrations = context.Database.GetPendingMigrations().ToArray();
      if (pendingMigrations.Any())
      {
        foreach (var pendingMigration in pendingMigrations)
        {
          Console.WriteLine("Applying migrations...");
          Console.WriteLine("\t" + pendingMigration);
          Console.WriteLine("DONE");
        }


        context.Database.Migrate();
      }
    }
  }
}
