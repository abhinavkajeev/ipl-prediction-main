const express = require("express");
const router = express.Router();
const { teams, venues, toss, seasons, headToHead, summary } = require("../controllers/statsController");

router.get("/teams", teams);
router.get("/venues", venues);
router.get("/toss", toss);
router.get("/seasons", seasons);
router.get("/head-to-head", headToHead);
router.get("/summary", summary);

module.exports = router;
