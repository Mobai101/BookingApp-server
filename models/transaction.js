const { Schema, model } = require("mongoose");

const transactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  hotel: { type: Schema.Types.ObjectId, ref: "Hotel" },
  roomNo: [{ type: String }],
  room: { type: Schema.Types.ObjectId, ref: "Room" },
  dateStart: { type: Date, required: true },
  dateEnd: { type: Date, required: true },
  price: { type: Number, required: true },
  payment: { type: String, required: true, default: "Cash" },
  status: { type: String, required: true, default: "Booked" },
});

module.exports = model("Transaction", transactionSchema);
