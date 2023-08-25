const express = require("express");

const bookingController = require("../controllers/booking");
const router = express.Router();

// Healthz check for render service
router.get("/healthz", (req, res, next) => {
  res.status(200).json({ message: "OK!" });
});

// Homepage
router.get("/", bookingController.getIndex);

// Search
router.get("/search", bookingController.getSearch);

// Detail
router.get("/detail/:hotelId", bookingController.getdetail);

// Reserve
router.get("/reserve/:hotelId", bookingController.getReserve);
router.post("/reserve/:hotelId", bookingController.postReserve);

// Transactions
router.get("/transactions", bookingController.getTransactions);

// login
router.post("/login", bookingController.postLogin);

// register
router.post("/register", bookingController.postRegister);

module.exports = router;
