const express = require("express");
const router = express.Router();

// module routes
router.use("/", require("./state.routes"));

// health / test route
router.get("/get", (req, res) => {
  res.send("Finance API is working");
});

module.exports = router;
