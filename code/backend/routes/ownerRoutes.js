const express = require("express");
const router = express.Router();

// Dummy test route for now (REPLACE this later with actual controller)
router.get("/test", (req, res) => {
  res.send("Owner route is working ✅");
});

module.exports = router;
