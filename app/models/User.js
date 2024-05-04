const { Schema } = require("mongoose");
module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: {
        type: Schema.Types.String,
        default: null,
      },
      email: {
        type: Schema.Types.String,
        required: true,
      },
      password: {
        type: Schema.Types.String,
        required: true,
        select: false,
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

  return mongoose.model("user", schema, "users");
};
