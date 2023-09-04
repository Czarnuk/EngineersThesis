using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }
        public string CreateToken(AppUser user)
        {
            //We are defining standard informations about user. This is a set of information about user.
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
            };
            //We are defining security key by which token will be encrypted and type of algorithm used to achieve this
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            //This part will descibe token which will be return
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                //Subject is going to include the claims that we want to return
                Subject = new ClaimsIdentity(claims),
                //We can add expiration time period. Token will expire after 7 days
                Expires = DateTime.Now.AddDays(7),
                //
                SigningCredentials = creds
            };
            // We create new instance of the System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler class to be able to create token below
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            //We are returning a token
            return tokenHandler.WriteToken(token);
        }
    }
}