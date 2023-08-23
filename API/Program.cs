using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));
//UseAuthentication asks "Do you have a valid token?"
app.UseAuthentication();
//UseAuthorization asks "Ok you have a valid token, now what are you allowed to do?"
app.UseAuthorization();

app.MapControllers();

app.Run();
