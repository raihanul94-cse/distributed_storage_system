const GoogleOAuthService = require("../services/GoogleOAuthService");
const GoogleDriveService = require("../services/GoogleDriveService");
const JsonResponse = require("../helpers/JsonResponse");
const model = require("../models");
const Mongoose = model.mongoose;
const ObjectId = Mongoose.Types.ObjectId;
const StorageConnection = model.storageConnection;

class StorageConnectionController {
  callbackStorageConnection = async (req, res) => {
    try {
      const schema = {
        code: {
          type: "string",
          nullable: true,
        },
        error: {
          type: "string",
          nullable: true,
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

      if (req.params.authType === "google-drive") {
        if (data.error === "access_denied") {
          return JsonResponse.error(res, "Access denied");
        }

        const googleAuthService = new GoogleOAuthService();

        const tokenData = await googleAuthService.getTokens(data.code);

        const userInfo = await googleAuthService.getUserInfo({
          access_token: tokenData.access_token,
        });

        if (userInfo && userInfo.data) {
          const storageConnection = await StorageConnection.create({
            userId: req.authData.id,
            accessToken: tokenData.access_token,
            expiryDate: tokenData.expiry_date,
            refreshToken: tokenData.refresh_token,
            accountEmail: userInfo.data.email,
            provider: "google-drive",
          });

          if (storageConnection) {
            return JsonResponse.success(res, {
              connected: true,
              authType: req.params.authType,
            });
          }
        }
      }

      return JsonResponse.error(res, "Unable to connect with system");
    } catch (err) {
      return JsonResponse.error(
        res,
        "Internal server error",
        null,
        500,
        "internal-error"
      );
    }
  };

  connectStorageConnection = async (req, res) => {
    try {
      if (req.params.authType === "google-drive") {
        const googleAuthService = new GoogleOAuthService();

        const redirectTo = await googleAuthService.getAuthUrl({
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive",
        });

        return JsonResponse.success(res, { redirectTo: redirectTo });
      }
    } catch (err) {
      return JsonResponse.error(
        res,
        "Internal server error",
        null,
        500,
        "internal-error"
      );
    }
  };

  disconnectStorageConnection = async (req, res) => {
    try {
      const schema = {
        storageConnectionId: {
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

      if (req.params.authType === "google-drive") {
        const googleAuthService = new GoogleOAuthService();

        const storageConnection = await StorageConnection.findOne({
          _id: data.storageConnectionId,
          userId: new ObjectId(req.authUser.id),
        }).select("+refreshToken");

        if (!storageConnection) {
          return JsonResponse.error(res, "Unable to disconnect from system");
        }

        await googleAuthService.revokeToken(storageConnection.refreshToken);
        await StorageConnection.deleteOne({
          _id: data.storageConnectionId,
          userId: new ObjectId(req.authUser.id),
        });
        return JsonResponse.success(res, {
          connected: false,
          authType: req.params.authType,
        });
      }
    } catch (err) {
      return JsonResponse.error(
        res,
        "Internal server error",
        null,
        500,
        "internal-error"
      );
    }
  };
}

module.exports = new StorageConnectionController();
