const { Schema, model } = require("mongoose");

const hotelSchema = new Schema({
  name: { type: String, required: true },
  cheapestPrice: { type: Number, required: true },
  type: { type: String, required: true, default: "hotel" },
  city: { type: String, required: true },
  address: { type: String, required: true },
  distance: { type: Number, required: true },
  photos: { type: [{ type: String }], default: [] },
  desc: { type: String, required: true },
  rating: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  rooms: { type: [{ type: Schema.Types.ObjectId, ref: "Room", default: [] }] },
});

hotelSchema.pre("save", async function (next) {
  if (!this.isModified("city")) return next();

  this.city = this.city.toLowerCase();
  next();
});

module.exports = model("Hotel", hotelSchema);
