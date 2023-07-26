const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminController = require("../controllers/admin");
const router = express.Router();

// login
router.post("/login", adminController.postLogin);

// register
router.post("/register", adminController.postRegister);

// Auth middleware for protected routes below
router.use(async (req, res, next) => {
  const userToken = req.headers.authorization;

  if (!userToken) {
    return res.status(403).json({ message: "Not logged in" });
  }
  const userId = jwt.verify(userToken, "super secret key").id;
  const foundUser = await User.findById(userId);
  if (!foundUser.isAdmin) {
    return res.status(403).json({ message: "User is not admin" });
  }
  next();
});

// DashBoard
router.get("/", adminController.getDashboard);

// Transactions
router.get("/transactions", adminController.getTransactions);

// hotels
router.get("/hotels", adminController.getHotels);
router.get("/hotels/new", adminController.getNewHotel);
router.post("/hotels/new", adminController.postNewHotel);
router.get("/hotels/delete/:hotelId", adminController.getDeleteHotel);
router.get("/hotels/edit/:hotelId", adminController.getEditHotel);
router.post("/hotels/edit/:hotelId", adminController.postEditHotel);

// rooms
router.get("/rooms", adminController.getRooms);
router.post("/rooms/new", adminController.postNewRoom);
router.get("/rooms/edit/:roomId", adminController.getEditRoom);
router.post("/rooms/edit/:roomId", adminController.postEditRoom);
router.get("/rooms/delete/:roomId", adminController.getDeleteRoom);

module.exports = router;
