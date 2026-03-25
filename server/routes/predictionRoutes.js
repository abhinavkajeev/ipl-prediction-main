const express = require("express");
const router = express.Router();
const { predict } = require("../controllers/predictionController");

router.post("/", predict);

module.exports = router;
