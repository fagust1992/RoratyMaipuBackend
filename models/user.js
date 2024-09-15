const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },

  nick: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "role_user",
  },
  image: {
    type: String,
    default: "default.png",
  },
  creat_at: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.plugin(mongoosePaginate);
// Cambia "Articulo" por "User" para reflejar el nombre correcto del modelo
module.exports = model("User", UserSchema, "users");
