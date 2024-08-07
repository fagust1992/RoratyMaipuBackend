const { Schema, model } = require("mongoose");

const PublicationSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    
    ref: "User",  // "User" corresponde a collecion base de datos

  },
  text: {
    type: String,
    required: true,
  },
  file: String,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = model("Publication", PublicationSchema, "publications");

