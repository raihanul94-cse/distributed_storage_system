const { Schema } = require("mongoose");
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      accessToken: {
        type: Schema.Types.String,
        required: true,
        select: false,
      },
      expiryDate: {
        type: Schema.Types.String,
        required: true,
        select: false,
      },
      refreshToken: {
        type: Schema.Types.String,
        required: true,
        select: false,
      },
      accountEmail: {
        type: Schema.Types.String,
        required: true,
      },
      provider: {
        type: Schema.Types.String,
        enum: ["google-drive", "one-drive", "dropbox", "mega"],
        required: true,
      },
      status: {
        type: Schema.Types.String,
        enum: ["active", "inactive", "deleted"],
        default: "active",
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("storageConnection", schema, "storageConnections");
};
