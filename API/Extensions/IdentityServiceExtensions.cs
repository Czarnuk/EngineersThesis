using System.Text;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt => {
                opt.Password.RequireNonAlphanumeric = false;
            })
                .AddRoles<AppRole>()
                .AddRoleManager<RoleManager<AppRole>>()
                .AddEntityFrameworkStores<DataContext>();
            /*
            I'm going to specify the type of authentication scheme that I'm going to be using inside this AddAuthentication parameter. To use this parameter JwtBearerDefaults.AuthenticationScheme I need nuget package called Microsoft.ASPNETCore.authentication.jwtbearer.
            Next step is to add JwtBearer token with some options for this method. That's how we define options: options.TokenValidationParameters = new TokenValidationParameters
            Below we specify all of the rules about how our server should validate token as a good token.
            ValidateIssuerSigningKey = true,                                                                        - this means that our server is going to check the token signing key and make sure it's valid based upon the issuer signing key, which will specify next. With no true value it won't check our token has been signed by the issuer and that means anybody can make up any random token as long as it's a JWT, then our server would accept it.
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"])), - here we need to specify what our issuer signing key is 
            ValidateIssuer = false,                                                                                 - the issuer of the token is of course my API server, but we'd need to pass that information down with the token in order to validate it. If we would have multiple issuers we should set true.
            ValidateAudience = false                                                                                - the same as property below. That's information that we have not passed with our token
            */
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => 
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddAuthorization(opt => 
            {
                opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                opt.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Moderator"));
            });
            
            return services;
        }
    }
    
}