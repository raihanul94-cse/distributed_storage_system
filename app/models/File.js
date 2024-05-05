const { Schema } = require("mongoose");
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      storageConnectionId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: Schema.Types.String,
        required: true,
      },
      description: {
        type: Schema.Types.String,
        required: true,
      },
      fileName: {
        type: Schema.Types.String,
        required: true,
      },
      fileSize: {
        type: Schema.Types.Number,
        required: true,
      },
      fileType: {
        type: Schema.Types.String,
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

  return mongoose.model("file", schema, "files");
};
