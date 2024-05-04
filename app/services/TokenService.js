const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const jwtConfig = require("../config/jwt");

class TokenService {
  generateToken = async (userId, expires, type, secret = jwtConfig.secret) => {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type: type,
    };
    return jwt.sign(payload, secret);
  };

  verifyToken = async (token) => {
    let decodedData = await jwt.verify(
      token,
      jwtConfig.secret,
      async (err, decoded) => {
        if (err) {
          throw new Error("Token not found");
        }

        return decoded;
      }
    );

    return decodedData;
  };

  generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(
      jwtConfig.ttl,
      "minutes"
    );
    const accessToken = await this.generateToken(
      user.id,
      accessTokenExpires,
      "access"
    );
    const refreshTokenExpires = moment().add(
      jwtConfig.refresh_ttl,
      "minutes"
    );
    const refreshToken = await this.generateToken(
      user.id,
      refreshTokenExpires,
      "refresh"
    );

    const tokens = {
      access: {
        token: accessToken,
        expires: accessTokenExpires.unix(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.unix(),
      },
    };

    return tokens;
  };
}

module.exports = TokenService;