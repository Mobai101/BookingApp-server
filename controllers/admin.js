const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

exports.postLogin = async (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  // Find user from database
  const foundUser = await User.findOne({ email: email });

  // Check if user is admin
  if (!foundUser.isAdmin) {
    return res.status(401).json({ message: "User is not admin" });
  }

  // Check if user exist
  if (!foundUser) {
    return res.status(401).json({ message: "User not found" });
  }

  // Check if password match
  const checkPass = await bcrypt.compare(req.body.password, foundUser.password);
  if (!checkPass) {
    return res.status(401).json({ message: "Password does not match" });
  } else {
    const token = jwt.sign({ id: foundUser._id }, "super secret key");
    res.status(200).json({
      status: "logged in",
      token: token,
      user: { username: foundUser.username, email: foundUser.email },
    });
  }
};

exports.postRegister = (req, res, next) => {
  const newUser = new User({
    username: req.body.username,
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    idCardNumber: req.body.idCardNumber,
    phoneNumber: req.body.phoneNumber,
    isAdmin: true,
  });
  newUser
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({ message: "User created" });
    })
    .catch((err) => {
      res.status(401).json({ message: err.message });
    });
};

exports.getDashboard = async (req, res, next) => {
  // fetching data to send to front end
  const allUser = await User.find({});
  const allTransactions = await Transaction.find({})
    .populate("user")
    .populate("hotel")
    .limit(8);
  const allEarning = allTransactions.reduce(
    (preVal, curVal) => preVal + +curVal.price,
    0
  );

  res.status(200).json({ userNo: allUser.length, allTransactions, allEarning });
};

exports.getTransactions = async (req, res, next) => {
  const allTransactions = await Transaction.find({})
    .populate("user")
    .populate("hotel");
  res.status(200).json({ allTransactions });
};

// Hotel
exports.getHotels = async (req, res, next) => {
  const allHotels = await Hotel.find({}).populate("rooms");
  res.status(200).json(allHotels);
};

exports.getNewHotel = async (req, res, next) => {
  const allRooms = await Room.find({}).select("title");
  res.status(200).json({ allRooms });
};

exports.postNewHotel = async (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.type ||
    !req.body.city ||
    !req.body.address ||
    !req.body.distance ||
    !req.body.rating ||
    !req.body.desc ||
    !req.body.price
  ) {
    res.status(422).json({
      message: "Validation error: please provide all required fields",
    });
  }

  const rooms = req.body.rooms.map((room) => room._id);

  const newHotel = new Hotel({
    name: req.body.name,
    type: req.body.type,
    city: req.body.city,
    address: req.body.address,
    distance: req.body.distance,
    desc: req.body.desc,
    rating: req.body.rating,
    cheapestPrice: req.body.price,
    photos: req.body.images,
    featured: req.body.featured === "true",
    rooms: rooms,
  });
  await newHotel.save();
  res.status(201).json({ message: "hotel created" });
};

exports.getDeleteHotel = async (req, res, next) => {
  const allTransactions = await Transaction.find({}).select("hotel -_id");
  const allTransactionsHotels = allTransactions.map((tran) =>
    tran.hotel.toString()
  );
  if (allTransactionsHotels.includes(req.params.hotelId)) {
    return res
      .status(400)
      .json({ message: "Hotel already has at least 1 transaction" });
  }
  await Hotel.findByIdAndDelete(req.params.hotelId);
  res.status(200).json({ message: "Hotel deleted successfully" });
};

exports.getEditHotel = async (req, res, next) => {
  const allRooms = await Room.find({}).select("title");
  const foundHotel = await Hotel.findById(req.params.hotelId).populate(
    "rooms",
    "title"
  );
  res.status(200).json({ allRooms, foundHotel });
};

exports.postEditHotel = async (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.type ||
    !req.body.city ||
    !req.body.address ||
    !req.body.distance ||
    !req.body.rating ||
    !req.body.desc ||
    !req.body.price
  ) {
    res.status(422).json({
      message: "Validation error: please provide all required fields",
    });
  }

  const rooms = req.body.rooms.map((room) => room._id);

  await Hotel.findByIdAndUpdate(req.params.hotelId, {
    name: req.body.name,
    type: req.body.type,
    city: req.body.city,
    address: req.body.address,
    distance: req.body.distance,
    desc: req.body.desc,
    rating: req.body.rating,
    cheapestPrice: req.body.price,
    photos: req.body.images,
    featured: req.body.featured === "true",
    rooms: rooms,
  });
  res.status(201).json({ message: "hotel updated" });
};

// Room
exports.getRooms = async (req, res, next) => {
  const allRooms = await Room.find({});
  res.status(200).json(allRooms);
};

exports.postNewRoom = async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.desc ||
    !req.body.price ||
    !req.body.maxPeople ||
    req.body.rooms.length === 0
  ) {
    res.status(422).json({
      message: "Validation error: please provide all required fields",
    });
  }

  const newRoom = new Room({
    title: req.body.title,
    desc: req.body.desc,
    price: req.body.price,
    maxPeople: req.body.maxPeople,
    roomNumbers: req.body.rooms,
  });
  await newRoom.save();
  res.status(201).json({ message: "room created" });
};

exports.getEditRoom = async (req, res, next) => {
  const foundRoom = await Room.findById(req.params.roomId);
  res.status(200).json(foundRoom);
};

exports.postEditRoom = async (req, res, next) => {
  console.log(req.body);

  if (
    !req.body.title ||
    !req.body.desc ||
    !req.body.price ||
    !req.body.maxPeople ||
    req.body.rooms.length === 0
  ) {
    res.status(422).json({
      message: "Validation error: please provide all required fields",
    });
  }

  await Room.findByIdAndUpdate(req.params.roomId, {
    title: req.body.title,
    desc: req.body.desc,
    price: req.body.price,
    maxPeople: req.body.maxPeople,
    roomNumbers: req.body.rooms,
  });

  res.status(201).json({ message: "room updated" });
};

exports.getDeleteRoom = async (req, res, next) => {
  const allTransactions = await Transaction.find({
    room: req.params.roomId,
    $or: [{ status: "Booked" }, { status: "CheckIn" }],
  });
  if (allTransactions.length >= 1) {
    return res
      .status(400)
      .json({ message: "Room already have customer Booked or Checked In" });
  }
  await Room.findByIdAndDelete(req.params.roomId);
  res.status(200).json({ message: "Room deleted successfully" });
};
