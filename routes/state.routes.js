const express = require("express");
const router = express.Router();

const stateController = require("../controllers/state.controller");
// const auth = require("../middlewares/authMiddleware"); // optional

router.get("/state", stateController.getStateList);
router.get("/state/:id", stateController.getStateById);
router.post("/state", stateController.createState);
router.put("/state/:id", stateController.updateState);
router.delete("/state/:id", stateController.deleteState);

module.exports = router;
