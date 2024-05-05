const { google } = require("googleapis");

class GoogleOAuthService {
  getTokens = async (code) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URL
    );

    const { tokens } = await oauth2Client.getToken(code);

    return tokens;
  };

  refreshTokens = async (refreshToken) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URL
    );

    const { tokens } = await oauth2Client.refreshToken(refreshToken);

    return tokens;
  };

  getAuthUrl = async (params) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URL
    );

    const authUrl = await oauth2Client.generateAuthUrl({
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: params.scope,
      login_hint: params.login_hint,
      state: params.state,
    });

    return authUrl;
  };

  getUserInfo = async (params) => {
    const oauth2Client = new google.auth.OAuth2();

    oauth2Client.setCredentials({ access_token: params.access_token });

    const oauth2 = google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });

    return await google
      .oauth2({
        version: "v2",
        auth: oauth2Client,
      })
      .userinfo.get();
  };

  revokeToken = async (token) => {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URL
    );
      
    return await oauth2Client.revokeToken(token);
  };
}

module.exports = GoogleOAuthService;