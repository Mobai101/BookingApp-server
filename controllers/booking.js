const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Hotel = require("../models/hotel");
const Room = require("../models/room");
const Transaction = require("../models/transaction");

const hotelsJSON = [
  {
    _id: { $oid: "6311a54a4a642f0142349086" },
    __v: 0,
    address: "Hang Da, 95 Hang Bong Street, Old Quarter, Hanoi, Vietnam",
    cheapestPrice: 150,
    city: "Ha Noi",
    desc: "Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in Old Quarter, allowing you access and proximity to local attractions and sights. Don't leave before paying a visit to the famous Old Quarter. Rated with 4 stars, this high-quality property provides guests with access to massage, restaurant and fitness center on-site.",
    distance: 10,
    featured: true,
    name: "HANOI ROYAL PALACE HOTEL 2",
    photos: [
      "https://pix8.agoda.net/hotelImages/14501735/-1/25517748837ba92fcb96c176f627d498.jpg?ce=0&s=1024x",
      "https://pix8.agoda.net/hotelImages/14501735/-1/0a77da6e3c4f95e95bd84f5dbaeb2a74.jpg?ca=11&ce=1&s=1024x",
      "https://pix8.agoda.net/hotelImages/14501735/-1/e76962680bcc984f7b0876da6ac5caa8.jpg?ca=11&ce=1&s=1024x",
      "https://pix8.agoda.net/hotelImages/14501735/-1/57474c14e32152ea509c39adaaf3f781.jpg?ca=11&ce=1&s=1024x",
    ],
    rooms: ["6310dd998cfecfd90b30ca28"],
    title: "HANOI ROYAL PALACE HOTEL 2",
    type: "hotel",
    rating: 4,
  },
  {
    _id: { $oid: "6311a9c64a642f01423490bf" },
    __v: 0,
    address: "Hang Dau, Hoan Kiem District, Hanoi, Vietnam",
    cheapestPrice: 600,
    city: "Ha Noi",
    desc: "Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in Hoan Kiem District, allowing you access and proximity to local attractions and sights. Don't leave before paying a visit to the famous Old Quarter. Rated with 4 stars, this high-quality property provides guests with access to massage, restaurant and hot tub on-site.",
    distance: 200,
    featured: true,
    name: "La Sinfonia del Rey Hotel and Spa",
    photos: [
      "https://pix8.agoda.net/hotelImages/8315970/-1/95c472f9e927d2f62293cb721818e6ad.jpg?ca=15&ce=1&s=1024x",
      "https://pix8.agoda.net/hotelImages/8315970/-1/70c9f415d4bbc7d2d86b492d46e5aa68.jpg?ca=10&ce=1&s=1024x",
      "https://pix8.agoda.net/hotelImages/8315970/-1/202714c15017a85fdcc8ab6674605f94.jpg?ca=10&ce=1&s=1024x",
      "https://pix8.agoda.net/hotelImages/8315970/-1/f6c5faa6f6fa8696a113fdefc0d259f8.jpg?ca=10&ce=1&s=1024x",
      "https://pix8.agoda.net/hotelImages/8315970/-1/f20208fb8f2fadcbeb9c246761aa6aab.jpg?ca=15&ce=1&s=1024x",
    ],
    rooms: [
      "6310dd998cfecfd90b30ca28",
      "6310e01a8cfecfd90b30ca30",
      "6311b2a24a642f01423490d6",
      "6311b3944a642f01423490df",
      "6311b47b4a642f01423490f4",
    ],
    title: "La Sinfonia del Rey Hotel and Spa",
    type: "hotel",
    rating: 3,
  },
  {
    _id: { $oid: "6311bd07f2fce6ea18172fa3" },
    __v: 0,
    address:
      "23-25 Nguyen Sieu, Hang Buom, Hoan Kiem, Old Quarter, Hanoi, Vietnam",
    cheapestPrice: 325,
    city: "Ha Noi",
    desc: "Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in Old Quarter, allowing you access and proximity to local attractions and sights. Don't leave before paying a visit to the famous Old Quarter. Rated with 4 stars, this high-quality property provides guests with access to massage, restaurant and fitness center on-site.",
    distance: 445,
    featured: false,
    name: "May De Ville Legend Hotel & Spa",
    photos: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/384702680.jpg?k=4ce101ca55c23ec96de4470425d21b0bbfeda9fdaf7bf87619c2886c2248107b&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/384702670.jpg?k=c2443ce23f7628eaa483f2d791de91d6d4a5d7f3548c1c6de5685aa5ecc1aca6&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/384702664.jpg?k=73e821816681f07e9fa3c148011c952f531db2fc9eecf0ca961c7183b3541b18&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/384702661.jpg?k=5b3d96967fb6ccb1d388c403bccc6d9ba59c0b1dea846a3485ee316139e63abe&o=&hp=1",
    ],
    rooms: ["6311be30f2fce6ea18172fa8", "6311be52f2fce6ea18172faf"],
    title: "May De Ville Legend Hotel & Spa",
    type: "hotel",
    rating: 4,
  },
  {
    _id: { $oid: "6311bf37f2fce6ea18172fb6" },
    __v: 0,
    address:
      "289-291 Ly Tu Trong Street, Ben Thanh Ward, District 1, District 1, Ho Chi Minh City, Vietnam",
    cheapestPrice: 350,
    city: "Ho Chi Minh",
    desc: "Get your trip off to a great start with a stay at this property, which offers free Wi-Fi in all rooms. Strategically situated in District 1, allowing you access and proximity to local attractions and sights. Don't leave before paying a visit to the famous War Remnants Museum. Rated with 4 stars, this high-quality property provides guests with access to massage, restaurant and fitness center on-site.",
    distance: 640,
    featured: true,
    name: "Alagon Saigon Hotel & Spa",
    photos: [
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/189108380.jpg?k=e99b98ebb53661882a81dd4e8e837c5a35a7a9c56f04364a4f5ea6c9ea68a3ef&o=&hp=1",
      "https://cf.bstatic.com/xdata/images/hotel/max1024x768/234191281.jpg?k=a518e4b7c752458eae5ea0fb36818694e4c0fac6ceec1c552239e9efbfadf746&o=&hp=1",
      "https://q-xx.bstatic.com/xdata/images/hotel/840x460/342349064.jpg?k=d91e6cc100ae3214c81d7e8ebaaba95adb9b6d66b3cb491a2bacbb162ee749df&o=",
      "https://q-xx.bstatic.com/xdata/images/hotel/840x460/342349110.jpg?k=5d9ebde5a24c290fd34ae061f3c456d0978c72b1e0e9a52f4e108be8983f24f1&o=",
      "https://q-xx.bstatic.com/xdata/images/hotel/840x460/342349111.jpg?k=40e4775e81abb65403ac305f04a7dd8e5ad889f5c33151f763e4ed1af3a63e7a&o=",
    ],
    rooms: ["6311c083f2fce6ea18172fba", "6311c0a8f2fce6ea18172fc3"],
    title: "Alagon Saigon Hotel & Spa",
    type: "hotel",
    rating: 5,
  },
];

exports.getIndex = async (req, res, next) => {
  try {
    // city types
    const cityType = ["ha noi", "ho chi minh", "da nang"];
    const cities = [];
    for (let city of cityType) {
      const count = await Hotel.countDocuments({ city: city });
      cities.push({
        name: city,
        count: count,
        image: `/cityImage/${city}.jpg`,
      });
    }

    // property types
    const propertyType = ["Hotel", "Apartment", "Resort", "Villa", "Cabin"];
    const properties = [];
    for (let property of propertyType) {
      const count = await Hotel.countDocuments({
        type: property.toLowerCase(),
      });
      properties.push({
        type: property,
        count: count,
        image: `/propertyImage/${property}.jpg`,
      });
    }

    // top 3 highest rating hotels
    const topRatingHotels = await Hotel.find({}).sort({ rating: -1 }).limit(3);

    // bundle into object and send to frontend
    res.status(200).json({ cities, properties, topRatingHotels });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

exports.postLogin = async (req, res, next) => {
  email = req.body.email;
  password = req.body.password;

  // Check if user exist
  const foundUser = await User.findOne({ email: email });
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
  console.log(req.body);
  const newUser = new User({
    username: req.body.username,
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    idCardNumber: req.body.idCardNumber,
    phoneNumber: req.body.phoneNumber,
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

exports.getdetail = async (req, res, next) => {
  try {
    const foundHotel = await Hotel.findById(req.params.hotelId);
    res.status(200).json(foundHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReserve = async (req, res, next) => {
  const userToken = req.headers.authorization;

  if (!userToken) {
    console.log("user not found");
    return res.status(403).json({ message: "Not logged in" });
  }

  const userId = jwt.verify(userToken, "super secret key").id;

  try {
    const foundHotel = await Hotel.findById(req.params.hotelId).populate(
      "rooms"
    );

    const foundUser = await User.findById(userId);
    res.status(200).json({ hotel: foundHotel, user: foundUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.postReserve = async (req, res, next) => {
  // verify user from token
  const userToken = req.headers.authorization;
  if (!userToken) {
    console.log("user not found");
    return res.status(403).json({ message: "Not logged in" });
  }
  const userId = jwt.verify(userToken, "super secret key").id;

  const roomNoArr = req.body.billArr.map((bill) => bill.roomNo);

  const newTransaction = new Transaction({
    user: userId,
    hotel: req.body.billArr[0].hotelId,
    room: req.body.billArr[0].roomId,
    roomNo: roomNoArr,
    dateStart: req.body.dates.startDate,
    dateEnd: req.body.dates.endDate,
    price: req.body.totalBill,
    payment: req.body.paymentMethod,
  });
  await newTransaction.save();
  res.status(201).json({ message: "Transaction created!" });
};

exports.getSearch = async (req, res, next) => {
  // Get data from search query
  const searchCity = req.query.city.toLowerCase();
  const startDate = new Date(req.query.start);
  const endDate = new Date(req.query.end);
  const adult = req.query.adult;
  const children = req.query.children;
  const people = +adult + +children;
  const rooms = req.query.rooms;

  // get hotel list filtered by search city
  let hotelList = await Hotel.find({ city: searchCity }).populate("rooms");

  // filter hotel list by number of rooms required
  hotelList = hotelList.filter((hotel) => hotel.rooms.length >= rooms);

  // filter hotel list by number of people
  hotelList = hotelList.filter((hotel) => {
    // prettier-ignore
    const maxCapacity = hotel.rooms.reduce((acc, curVal) => acc + +curVal.maxPeople, 0);
    return maxCapacity >= people;
  });

  // filter hotel list by dates
  for (let i = 0; i < hotelList.length; i++) {
    const hotelTransactions = await Transaction.find({
      hotel: hotelList[i]._id,
    });

    hotelTransactions.forEach((transaction) => {
      const tranStartDate = new Date(transaction.dateStart);
      const tranEndDate = new Date(transaction.dateEnd);

      if (tranStartDate < endDate && tranEndDate > startDate) {
        hotelList.splice(i, 1);
      }
    });
  }

  res.status(200).json(hotelList);
};

exports.getTransactions = async (req, res, next) => {
  // verify user from token
  const userToken = req.headers.authorization;
  if (!userToken) {
    console.log("user not found");
    return res.status(403).json({ message: "Not logged in" });
  }
  const userId = jwt.verify(userToken, "super secret key").id;

  const userTransactions = await Transaction.find({ user: userId })
    .populate("hotel")
    .populate("room");
  res.status(200).json(userTransactions);
};
