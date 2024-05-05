const bcrypt = require("bcryptjs");
const TokenService = require("../services/TokenService");
const PayloadValidator = require("../helpers/PayloadValidator");
const JsonResponse = require("../helpers/JsonResponse");
const model = require("../models");
const User = model.user;

class AuthController {
  constructor() {
    this.tokenService = new TokenService();
  };

  login = async (req, res) => {
    try {
      const schema = {
        email: {
          type: "string",
          required: true,
        },
        password: {
          type: "string",
          required: true,
        },
      };

      const validator = new PayloadValidator(schema);

      const validationResult = validator.validate(req.body);

      if (!validationResult.isValid) {
        return JsonResponse.error(
          res,
          "Invalid payload",
          validationResult.errors,
          "validation"
        );
      }

      let data = validationResult.data;

      const user = await User.findOne({
        email: data.email,
      }).select("+password");

      if (user) {
        const isPasswordValid = bcrypt.compareSync(
          data.password,
          user.password
        );

        if (isPasswordValid) {
          let tokens = await this.tokenService.generateAuthTokens(user);

          return JsonResponse.success(res, tokens);
        }
      }
      return JsonResponse.error(res, "Invalid login credentials");
    } catch (err) {
      return JsonResponse.error(res, "Internal server error", null, 500, "internal-error");
    }
  };

  register = async (req, res) => {
    try {
      const schema = {
        name: {
          type: "string",
          required: false,
        },
        email: {
          type: "string",
          required: true,
        },
        password: {
          type: "string",
          required: true,
        },
      };

      const validator = new PayloadValidator(schema);

      const validationResult = validator.validate(req.body);

      if (!validationResult.isValid) {
        return JsonResponse.error(
          res,
          "Invalid payload",
          validationResult.errors,
          400,
          "validation"
        );
      }

      let data = validationResult.data;

      const isEmailExists = await User.findOne({ email: data.email });

      if (isEmailExists) {
        return JsonResponse.error(
          res,
          "Invalid payload",
          { field: "email", error: "Email already exists" },
          400,
          "validation"
        );
      }

      const user = await User.create({
        name: data.name,
        email: data.email,
        password: bcrypt.hashSync(data.password ? data.password : "", 8),
      });

      if (user) {
        const response = {
          email: user.email,
        };

        return JsonResponse.success(res, response);
      }
      return JsonResponse.error(res, "Failed to register user");
    } catch (err) {
      return JsonResponse.error(res, "Internal server error", null, 500, "internal-error");
    }
  };
}

module.exports = new AuthController();
