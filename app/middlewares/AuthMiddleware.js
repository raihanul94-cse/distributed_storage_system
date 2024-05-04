const JsonResponse = require("../helpers/JsonResponse");
const models = require("../models");
const TokenService = require("../services/TokenService");
const User = models.user;

class AuthMiddleware {
  constructor() {
    this.tokenService = new TokenService();
  }

  user = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const authQuery = req.query._token;

    let token = authHeader && authHeader.split(" ")[1];

    if (authQuery) {
      token = authQuery;
    }

    if (token == null) {
      return JsonResponse.error(res, "Access token is missing", null, 401);
    }

    try {
      const authUser = await this.tokenService.verifyToken(token);

      const user = await User.findOne({ _id: authUser.sub });
      req.authUser = user;
      next();
    } catch (err) {
      return JsonResponse.error(res, "Invalid access token", null, 401);
    }
  };
}

module.exports = new AuthMiddleware();
