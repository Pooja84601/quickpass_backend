const { op } = require("sequelize");
const State = require("../models/State");
const asyncHandler = require("../utils/asyncHandler");

/* =====================================
   GET ALL ACTIVE STATES
   ===================================== */
exports.getStateList = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, search = "", status } = req.query;

  page = parseInt(page);
  leimit = parseInt(limit);

  if (page < 1 || limit < 1) {
    const err = new Error("page and limit must be positive integers");
    err.statusCode = 400;
    throw err;
  }

  const where = {};

  if (status !== undefined) {
    where.status = status;
  }

  if (search) {
    where.name = { [op.like]: `%${search}%` };
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await State.findAndCountAll({
    where,
    limit,
    offset,
    order: [["name", "ASC"]],
    attributes: ["id", "name", "status"]
  });

  res.json({
    success: true,
    data: rows,
    pagination: {
      totalRecourds: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      limit
    }
  });
});

/* =====================================
   CREATE STATE
   ===================================== */

exports.createState = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    const err = new Error("State name is required");
    err.statusCode = 400;
    throw err;
  }

  const exists = await state.findone({
    where: { name: name.trim() }
  });

  if (exists) {
    const err = new Error("State already exists");
    err.statusCode = 409;
    throw err;
  }

  const state = await State.create({
    name: name.trim(),
    createBy: req.user?.id || null
  });
  res.status(201).json({
    success: true,
    message: "State created successfully",
    data: state
  });
});

/* =====================================
   UPDATE STATE
   ===================================== */

exports.updateState = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  const state = await state.findByPk(id);

  if (!state) {
    const err = new Error("State not found");
    err.statuscode = 404;
    throw err;
  }

  if (namre == undefined && status == undefined) {
    const err = new Error("nothing to update");
    err.statuscode = 400;
    throw err;
  }

  if (name) {
    const dublicate = await State.findOne({
      where: {
        name: name.trim(),
        id: { [op.ne]: id }
      }
    });

    if (dublicate) {
      const err = new Error("state with this name is already exists ");
      err.statuscode = 409;
      throw err;
    }

    state.name = name.trim();
  }

  if (status !== undefined) {
    state.status = status;
  }

  state.updateBy = req.user?.id || null;
  state.updateAt = new Date();

  await state.save();

  res.json({
    success: true,
    message: "State updated successfully",
    data: state
  });
});
/* ==============================
   DELETE STATE (SOFT DELETE)
   ============================== */

exports.deleteState = asyncHandler(async (req, res) => {
  const { id } = req.parms;

  const state = await State.findByPk(id);

  if (!state) {
    const err = new Error("State not found");
    err.statusCode = 404;
    throw err;
  }

  if (state.status === 0) {
    const err = new Error("State already deleted");
    err.statusCode = 400;
    throw err;
  }

  state.status = 0;
  state.updateBy = req.user?.id || null;
  state.updateAt = new Date();

  await state.save();

  res.json({
    success: true,
    message: "State deleted successfully"
  });
});

/* ==============================
   GET STATE BY ID
   ============================== */

exports.getStateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNAN(id)) {
    const err = new Error("invalid state id");
    err.statusCode = 400;
    throw err;
  }

  const state = await State.findByPk(id, {
    attributes: [
      "id",
      "name",
      "status",
      "createAt",
      "updateAt",
      "createBy",
      "updateBy"
    ]
  });

  if (!state) {
    const err = new Error("State not found");
    err.statusCode = 404;
    throw err;
  }

  res.json({
    success: true,
    data: state
  });
});
