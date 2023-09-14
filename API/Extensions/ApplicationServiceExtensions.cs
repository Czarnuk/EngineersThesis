using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    //static class is a class from which we can use inside methods with no initialization
    public static class ApplicationServiceExtensions
    {
        //IServiceCollection is what we will return. First parameter for AddApplicationServices is what we will extend, we want to use IConfiguration parameter also
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors();
            /*
            We have 3 options about the lifetime of how long do we want this service to be available for.
            1.) AddTransient - token service would be created and disposed within the request as soon as it's used and finished with. Too short for me. AddTransient lives only when was created by framework or controller and disposed when finished his work so a little faster that AddScoped.
            2.) AddScoped - As a request hit the endpoint, we create controller so the framework instantiates a new instance of that controller. The controller look at it's dependencies or the framework does and need to create these services and create new instances of these services when the controller's created. When the controlles is diposed of at the end of HTTP request, then any dependent services are also disposed. Tha's how long in AddScoped this service lives.
            3.) AddSingleton - This service's instantiated when the application first starts and is never disposed until the application has closed down. it will work in this case but we would have a service hanging around in memory that we're not actually using on a consistent basis. We only need the token service when we need to create a token, and we don't need to have that token service residing in memory for the entire lenght of the application lifetime.
            */
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<ILikesRepository, LikesRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddSignalR();
            services.AddSingleton<PresenceTracker>();

            return services;
        }
    }
}