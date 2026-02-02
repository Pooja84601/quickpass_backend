const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const db = require("./config/db"); // mysql pool
const sequelize = require("./config/sequelize"); // sequelize (state only)

const indexRoutes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", indexRoutes);

app.use(errorHandler);

/* ===== MySQL Pool Check ===== */
db.getConnection()
  .then((connection) => {
    console.log("MySQL pool connected");
    connection.release();
  })
  .catch((err) => console.error("MySQL error:", err.message));

/* ===== Sequelize Check (State only) ===== */
sequelize
  .authenticate()
  .then(() => console.log("Sequelize connected (state only)"))
  .catch((err) => console.error("Sequelize error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
