const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let url = `mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`; 

if(process.env.NODE_ENV === "production"){
    url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
}

const db = {};
db.mongoose = mongoose;
db.url = url;

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const model = require(path.join(__dirname, file))(mongoose);
    db[model.modelName] = model;
  });

module.exports = db;