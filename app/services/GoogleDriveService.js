const stream = require("stream");
const { google } = require("googleapis");

class GoogleDriveService {
  constructor(refreshToken) {
    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    });
    auth.credentials.refresh_token = refreshToken;
    this.driveService = google.drive({
      version: "v3",
      auth,
    });

    this.bucketId = null;
  }

  uploadFile = async (fileName, fileData, fileMimetype) => {
    try {
      const fileMetaData = {
        name: fileName,
        parents: [this.bucketId],
      };
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileData);
      const media = {
        mimeType: fileMimetype,
        body: bufferStream,
      };

      const response = await this.driveService.files.create({
        resource: fileMetaData,
        media: media,
        field: "id",
      });
      return response.data.id;
    } catch (err) {
      return false;
    }
  };

  downloadFile = async (fileId) => {
    try {
      const response = await this.driveService.files.get(
        {
          fileId: fileId,
          alt: "media",
        },
        { responseType: "stream" }
      );

      return response;
    } catch (err) {
      return false;
    }
  };

  deleteFile = async (fileId) => {
    try {
      const response = await this.driveService.files.delete({
        fileId: fileId,
        field: "id",
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  deleteFolder = async (fileId) => {
    try {
      const response = await this.driveService.files.delete({
        fileId: fileId,
        field: "id",
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  createFolder = async (bucketName) => {
    try {
      const fileMetaData = {
        name: bucketName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [this.bucketId],
      };

      const response = await this.driveService.files.create({
        resource: fileMetaData,
        field: "id",
      });

      return response.data.id;
    } catch (err) {
      return false;
    }
  };

  getStorageDetails = async () => {
    try {
      const response = await this.driveService.about.get({
        fields: "storageQuota",
      });

      return response;
    } catch (err) {
      return false;
    }
  };
}

module.exports = GoogleDriveService;
