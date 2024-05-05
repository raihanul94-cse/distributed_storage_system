const { Schema } = require("mongoose");
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      fileId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      description: {
        type: Schema.Types.String,
        required: true,
      },
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("fileDownload", schema, "fileDownloads");
};
